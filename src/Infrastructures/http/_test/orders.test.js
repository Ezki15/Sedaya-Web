import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import OrderTableTestHelper from '../../../../test/OrderTableTestHelper.js';
import UserTableTestHelper from '../../../../test/UsersTableTestHelper.js';
import ProductsTableTestHelper from '../../../../test/ProductsTableTestHelper.js';
import createServer from '../CreateServer.js';
import container from '../../container.js';

describe('/orders endpoint', () => {
  afterEach(async () => {
    await OrderTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
    await ProductsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /orders', () => {
    it('should response 201 and persisted order', async () => {
    // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'userapp' });
      await ProductsTableTestHelper.addProduct({ id: 'product-123', name: 'Product 1', price: 10000 });
      await ProductsTableTestHelper.addProduct({ id: 'product-456', name: 'Product 2', price: 20000 });

      const orderPayload = [{
        productId: 'product-123',
        quantity: 2,
        price: 10000,
      },
      {
        productId: 'product-456',
        quantity: 1,
        price: 20000,
      }];
      const userId = 'user-123';

      const server = await createServer(container);
      const response = await request(server)
        .post('/orders')
        .set('Authorization', `Bearer ${await OrderTableTestHelper.generateMockToken(userId, 'userapp')}`)
        .send(orderPayload);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toBe(201);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
    });

    it('should return 400 if required fields are missing', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'userapp' });
      await ProductsTableTestHelper.addProduct({ id: 'product-123', name: 'Product 1' });
      await ProductsTableTestHelper.addProduct({ id: 'product-456', name: 'Product 2' });

      const orderPayload = [{
        productId: 'product-123',
        // quantity is missing
      },
      {
        productId: 'product-456',
        quantity: 1,
      }];
      const userId = 'user-123';
      const server = await createServer(container);

      //   Action
      const response = await request(server)
        .post('/orders')
        .set('Authorization', `Bearer ${await OrderTableTestHelper.generateMockToken(userId, 'userapp')}`)
        .send(orderPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toBe(400);
      expect(responseJson.status).toBe('fail');
    });

    it('should return 401 when no authentication token is provided', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'userapp' });
      await ProductsTableTestHelper.addProduct({ id: 'product-123', name: 'Product 1' });
      await ProductsTableTestHelper.addProduct({ id: 'product-456', name: 'Product 2' });

      const orderPayload = [{
        productId: 'product-123',
        quantity: 2,
      },
      {
        productId: 'product-456',
        quantity: 1,
      }];
      const server = await createServer(container);

      //   Action
      const response = await request(server)
        .post('/orders')
        .send(orderPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toBe(401);
      expect(responseJson.status).toBe('fail');
    });
  });

  describe('GET /orders', () => {
    it('should return 200 and a list of orders', async () => {
      // Arrange
      // test 1
      await UserTableTestHelper.addUser({
        id: 'user-123', username: 'adminapp', email: 'admnin@gmail.com', role: 'admin',
      });
      await UserTableTestHelper.addUser({ id: 'user-234', username: 'userapp1', email: 'userapp1@gmail.com' });
      await ProductsTableTestHelper.addProduct({ id: 'product-123', name: 'Product 1', price: 10000 });
      await ProductsTableTestHelper.addProduct({ id: 'product-456', name: 'Product 2', price: 20000 });

      const orderPayload1 = [{
        productId: 'product-123',
        quantity: 2,
        price: 10000,
      },
      {
        productId: 'product-456',
        quantity: 1,
        price: 20000,
      }];
      const userId1 = 'user-234';
      const adminId = 'user-123';

      // test 2
      await UserTableTestHelper.addUser({ id: 'user-345', username: 'userapp2', email: 'userapp2@gmail.com' });
      await ProductsTableTestHelper.addProduct({ id: 'product-234', name: 'Product 3', price: 10000 });
      await ProductsTableTestHelper.addProduct({ id: 'product-567', name: 'Product 4', price: 20000 });

      const orderPayload2 = [{
        productId: 'product-234',
        quantity: 2,
        price: 10000,
      },
      {
        productId: 'product-567',
        quantity: 1,
        price: 20000,
      }];
      const userId2 = 'user-345';

      await request(await createServer(container))
        .post('/orders')
        .set('Authorization', `Bearer ${await OrderTableTestHelper.generateMockToken(userId1, 'userapp1')}`)
        .send(orderPayload1);

      await request(await createServer(container))
        .post('/orders')
        .set('Authorization', `Bearer ${await OrderTableTestHelper.generateMockToken(userId2, 'userapp2')}`)
        .send(orderPayload2);

      // Action
      const response = await request(await createServer(container))
        .get('/orders')
        .set('Authorization', `Bearer ${await OrderTableTestHelper.generateMockToken(adminId, 'adminapp')}`);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toBe(200);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data.orders).toBeDefined();
    });
  });

  describe('GET /orders/:id', () => {
    it('should return 200 and orders of the user', async () => {
      // Arrange
      // test 1
      await UserTableTestHelper.addUser({
        id: 'user-123', username: 'adminapp', email: 'admnin@gmail.com', role: 'admin',
      });
      await UserTableTestHelper.addUser({ id: 'user-234', username: 'userapp1', email: 'userapp1@gmail.com' });
      await ProductsTableTestHelper.addProduct({ id: 'product-123', name: 'Product 1', price: 10000 });
      await ProductsTableTestHelper.addProduct({ id: 'product-456', name: 'Product 2', price: 20000 });

      const orderPayload1 = [{
        productId: 'product-123',
        quantity: 2,
        price: 10000,
      },
      {
        productId: 'product-456',
        quantity: 1,
        price: 20000,
      }];
      const userId1 = 'user-234';
      // const adminId = 'user-123';

      // test 2
      await UserTableTestHelper.addUser({ id: 'user-345', username: 'userapp2', email: 'userapp2@gmail.com' });
      await ProductsTableTestHelper.addProduct({ id: 'product-234', name: 'Product 3', price: 10000 });
      await ProductsTableTestHelper.addProduct({ id: 'product-567', name: 'Product 4', price: 20000 });

      const orderPayload2 = [{
        productId: 'product-234',
        quantity: 2,
        price: 10000,
      },
      {
        productId: 'product-567',
        quantity: 1,
        price: 20000,
      }];
      const userId2 = 'user-345';

      const orders1 = await request(await createServer(container))
        .post('/orders')
        .set('Authorization', `Bearer ${await OrderTableTestHelper.generateMockToken(userId1, 'userapp1')}`)
        .send(orderPayload1);

      const { data } = orders1.body;

      await request(await createServer(container))
        .post('/orders')
        .set('Authorization', `Bearer ${await OrderTableTestHelper.generateMockToken(userId2, 'userapp2')}`)
        .send(orderPayload2);

      // Action
      const orderId = data.id;
      const response = await request(await createServer(container))
        .get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${await OrderTableTestHelper.generateMockToken(userId1, 'userapp1')}`);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toBe(200);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data.orders).toBeDefined();
    });
  });

  describe('when PATCH /orders/status', () => {
    it('should update order and return 200', async () => {
      // Arrange
      await UserTableTestHelper.addUser({
        id: 'user-123', username: 'adminapp', email: 'admnin@gmail.com', role: 'admin',
      });
      await UserTableTestHelper.addUser({
        id: 'user-234', username: 'userpp', email: 'userapp@gmail.com', role: 'user',
      });
      await OrderTableTestHelper.addOrder({ id: 'order-123', userId: 'user-234' });
      await OrderTableTestHelper.addOrder({ id: 'order-234', userId: 'user-234' });

      const requestPayload = {
        orderIds: ['order-123', 'order-234'],
        status: 'completed',
      };
      const adminId = 'user-123';
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .patch('/orders/status')
        .set('Authorization', `Bearer ${await OrderTableTestHelper.generateMockToken(adminId, 'adminapp')}`)
        .send(requestPayload);

      // Assert
      const responseJson = response.body;
      // console.dir(responseJson, { depth: null });
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });
  });
});
