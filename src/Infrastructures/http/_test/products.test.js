import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import ProductsTableTestHelper from '../../../../test/ProductsTableTestHelper.js';
import createServer from '../CreateServer.js';
import container from '../../container.js';

describe(' /products endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ProductsTableTestHelper.cleanTable();
  });

  describe('when POST /products', () => {
    it('should response 201 and persisted product', async () => {
      // Arrange
      const requestPayload = {
        name: 'Product A',
        price: 10000,
        stock: 50,
      };

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/products')
        .set('Authorization', 'Bearer valid_token') // assuming a valid token is used
        .send(requestPayload);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toBe(201);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
    });

    it('should response 401 when no authentication token is provided', async () => {
      // Arrange
      const requestPayload = {
        name: 'Product B',
        price: 20000,
        stock: 30,
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/products')
        .send(requestPayload);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
