/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import OrderTableTestHelper from '../../../../test/OrderTableTestHelper.js';
import UserTableTestHelper from '../../../../test/UsersTableTestHelper.js';
import ProductTableTestHelper from '../../../../test/ProductsTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import NewOrder from '../../../Domains/orders/entities/NewOrder.js';
import OrderRepositoryPostgres from '../OrderRepositoryPostgres.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('OrderRepositoryPostgres', () => {
  afterEach(async () => {
    await OrderTableTestHelper.cleanTable();
    await ProductTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addOrder function', () => {
    it('should persist new order', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ProductTableTestHelper.addProduct({ id: 'product-123', price: 50000 });
      await ProductTableTestHelper.addProduct({ id: 'product-234', price: 10000 });
      const payload = [
        { productId: 'product-123', quantity: 2, price: 50000 },
        { productId: 'product-234', quantity: 5, price: 10000 },
      ];

      const userId = 'user-123';
      const totalPrice = 100000; // Example total price
      const newOrder = new NewOrder(payload, totalPrice, userId);

      let counter = 122; // Simulate ID generation
      const fakeIdGenerator = () => `${++counter}`;
      const orderRepository = new OrderRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await orderRepository.addOrder(newOrder);

      // Assert
      const order = await OrderTableTestHelper.findOrderById('order-123');
      expect(order).toHaveLength(1);
    });

    it('should return the added order correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ProductTableTestHelper.addProduct({ id: 'product-123', price: 50000 });
      await ProductTableTestHelper.addProduct({ id: 'product-234', price: 10000 });
      // Prepare payload
      const payload = [
        { productId: 'product-123', quantity: 2, price: 50000 },
        { productId: 'product-234', quantity: 5, price: 10000 },
      ];

      const userId = 'user-123';
      const totalPrice = 100000; // Example total price
      const newOrder = new NewOrder(payload, totalPrice, userId);
      let counter = 122; // Simulate ID generation
      const fakeIdGenerator = () => `${++counter}`;
      const orderRepository = new OrderRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedOrder = await orderRepository.addOrder(newOrder);

      // Assert
      expect(addedOrder).toStrictEqual({
        id: 'order-123',
        totalPrice: newOrder.totalPrice,
        status: 'pending',
      });
    });

    it('should rollback if order_items insert fails', async () => {
    // Arrange: buat user
      await UserTableTestHelper.addUser({ id: 'user-123' });

      // Payload dengan productId yang tidak ada di tabel products (akan bikin FK error)
      const payload = [
        { productId: 'product-not-exist', quantity: 2, price: 50000 },
      ];

      const userId = 'user-123';
      const totalPrice = 100000;
      const newOrder = new NewOrder(payload, totalPrice, userId);

      const fakeIdGenerator = () => '123';
      const orderRepository = new OrderRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert: harus throw error
      await expect(orderRepository.addOrder(newOrder))
        .rejects.toThrow();

      // Setelah gagal, tabel orders HARUS tetap kosong (rollback jalan)
      const orders = await OrderTableTestHelper.findOrderById('order-123');
      expect(orders).toHaveLength(0);
    });
  });

  describe('getAllOrders function', () => {
    it('should return all the orders', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ProductTableTestHelper.addProduct({ id: 'product-123', price: 50000 });
      await ProductTableTestHelper.addProduct({ id: 'product-234', price: 10000 });
      const payload = [
        { productId: 'product-123', quantity: 2, price: 50000 },
        { productId: 'product-234', quantity: 5, price: 10000 },
      ];

      const userId = 'user-123';
      const totalPrice = 100000; // Example total price
      const newOrder = new NewOrder(payload, totalPrice, userId);

      let counter = 122; // Simulate ID generation
      const fakeIdGenerator = () => `${++counter}`;
      const orderRepository = new OrderRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await orderRepository.addOrder(newOrder);
      const ordersResult = await orderRepository.getAllOrders();

      // Test that the return value is an object with 'orders' and 'itemsOrder' keys
      expect(ordersResult).toHaveProperty('orders');
      expect(ordersResult).toHaveProperty('itemsOrder');
      expect(Array.isArray(ordersResult.orders)).toBe(true);
      expect(Array.isArray(ordersResult.itemsOrder)).toBe(true);

      // Test that getAllOrders returns empty arrays if no orders exist
      await OrderTableTestHelper.cleanTable();
      const emptyResult = await orderRepository.getAllOrders();
      expect(emptyResult.orders).toHaveLength(0);
      expect(Array.isArray(emptyResult.itemsOrder)).toBe(true);
      expect(emptyResult.itemsOrder).toHaveLength(0);
    });
  });

  describe('getOrderById function', () => {
    it('should return the correct orders', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ProductTableTestHelper.addProduct({ id: 'product-123', price: 50000 });
      await ProductTableTestHelper.addProduct({ id: 'product-234', price: 10000 });
      const payload = [
        { productId: 'product-123', quantity: 2, price: 50000 },
        { productId: 'product-234', quantity: 5, price: 10000 },
      ];

      const userId = 'user-123';
      const totalPrice = 100000; // Example total price
      const newOrder = new NewOrder(payload, totalPrice, userId);

      let counter = 122; // Simulate ID generation
      const fakeIdGenerator = () => `${++counter}`;
      const orderRepository = new OrderRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await orderRepository.addOrder(newOrder);
      const ordersResult = await orderRepository.getOrderById(userId);

      // Test that the return value is an object with 'orders' and 'itemsOrder' keys
      expect(ordersResult).toHaveProperty('orders');
      expect(ordersResult).toHaveProperty('itemsOrder');
      expect(Array.isArray(ordersResult.orders)).toBe(true);
      expect(Array.isArray(ordersResult.itemsOrder)).toBe(true);
    });
  });

  describe('validateAvailableOrder function', () => {
    it('should throw NotFoundError when order is not available', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await OrderTableTestHelper.addOrder({ id: 'order-123', userId: 'user-123' });

      const orderId = 'order-234';
      const orderRepository = new OrderRepositoryPostgres(pool, {});

      // Action & assert
      await expect(orderRepository.validateAvailableOrder(orderId)).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when order is available', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await OrderTableTestHelper.addOrder({ id: 'order-123', userId: 'user-123' });

      const orderId = 'order-123';
      const orderRepository = new OrderRepositoryPostgres(pool, {});

      // Action & assert
      await expect(orderRepository.validateAvailableOrder(orderId)).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('updateOrder function', () => {
    it('should update order status', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await OrderTableTestHelper.addOrder({ id: 'order-123', userId: 'user-123' });

      const payload = {
        orderId: 'order-123',
        status: 'completed',
      };
      const orderRepository = new OrderRepositoryPostgres(pool, {});

      // Action
      const updatedOrder = await orderRepository.updateOrder(payload);

      // Assert
      expect(updatedOrder.orderId).toEqual('order-123');
      expect(updatedOrder.status).toEqual('completed');
    });
  });
});
