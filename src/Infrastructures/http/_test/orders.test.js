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
});
