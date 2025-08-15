import OrderTableTestHelper from '../../../../test/OrderTableTestHelper.js';
import UserTableTestHelper from '../../../../test/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import NewOrder from '../../../Domains/orders/entities/NewOrder.js';
import OrderRepositoryPostgres from '../OrderRepositoryPostgres.js';
// import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('OrderRepositoryPostgres', () => {
  afterEach(async () => {
    await OrderTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addOrder function', () => {
    it('should persist new order', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      const payload = [
        { productId: 'product-123', quantity: 2 },
        { productId: 'product-234', quantity: 5 },
      ];

      const userId = 'user-123';
      const totalPrice = 100000; // Example total price
      const newOrder = new NewOrder(payload, totalPrice, userId);

      const fakeIdGenerator = () => '123';
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
      const payload = [
        { productId: 'product-123', quantity: 2 },
        { productId: 'product-234', quantity: 5 },
      ];

      const userId = 'user-123';
      const totalPrice = 100000; // Example total price
      const newOrder = new NewOrder(payload, totalPrice, userId);
      const fakeIdGenerator = () => '123';
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
  });

  //   describe('findOrderById function', () => {
  //     it('should throw NotFoundError when order not found', async () => {
  //       // Arrange
  //       const orderRepository = new OrderRepositoryPostgres(pool, {});

  //       // Action & Assert
  //       await expect(orderRepository.findOrderById('order-999')).rejects.toThrow(NotFoundError);
  //     });

  //     it('should return the order when found', async () => {
  //       // Arrange
  //       await OrderTableTestHelper.addOrder({
  //         id: 'order-123',
  //         userId: 'user-123',
  //         quantity: 1,
  //         totalPrice: 100000,
  //         status: 'pending',
  //       });
  //       const orderRepository = new OrderRepositoryPostgres(pool, {});

//       // Action
//       const order = await orderRepository.findOrderById('order-123');
//       // Assert
//       expect(order).toHaveLength(1);
//       expect(order[0]).toHaveProperty('id', 'order-123');
//       expect(order[0]).toHaveProperty('userId', 'user-123');
//       expect(order[0]).toHaveProperty('quantity', 1);
//       expect(order[0]).toHaveProperty('totalPrice', 100000);
//       expect(order[0]).toHaveProperty('status', 'pending');
//     });
//   });
});
