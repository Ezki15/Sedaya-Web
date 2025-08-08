import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import ProductsTableTestHelper from '../../../../test/ProductsTableTestHelper.js';
import UserTableTestHelper from '../../../../test/UsersTableTestHelper.js';
import createServer from '../CreateServer.js';
import container from '../../container.js';

describe(' /products endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UserTableTestHelper.cleanTable();
    await ProductsTableTestHelper.cleanTable();
  });

  describe('when POST /products', () => {
    it('should response 201 and persisted product', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ role: 'admin' }); // Ensure an admin user exists
      const requestPayload = {
        name: 'Product A',
        description: 'Description of Product A',
        price: 10000,
        stock: 50,
      };

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/products')
        .set('Authorization', `Bearer ${await ProductsTableTestHelper.generateMockToken()}`) // assuming a valid token is used
        .send(requestPayload);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toBe(201);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
    });

    it('should response 403 when user not admin', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-234', username: 'userNonAdmin', role: 'user' }); // Ensure a non-admin user exists
      const requestPayload = {
        name: 'Product A',
        description: 'Description of Product A',
        price: 10000,
        stock: 50,
      };

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/products')
        .set('Authorization', `Bearer ${await ProductsTableTestHelper.generateMockToken('user-234', 'userNonAdmin')}`) // assuming a valid token is used
        .send(requestPayload);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toBe(403);
      expect(responseJson.status).toBe('fail');
    });

    it('should response 401 when no authentication token is provided', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ role: 'admin' }); // Ensure an admin user exists
      const requestPayload = {
        name: 'Product B',
        description: 'Description of Product B',
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

  it('should response 400 when request payload not contain needed property', async () => {
    // Arrange
    await UserTableTestHelper.addUser({ role: 'admin' });
    const requestPayload = {
      name: 'Product C',
      // description is missing
      price: 30000,
      stock: 20,
    };
    const server = await createServer(container);

    // Action
    const response = await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${await ProductsTableTestHelper.generateMockToken()}`)
      .send(requestPayload);

    // Assert
    const responseJson = response.body;

    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
  });
  it('should response 400 when request payload has invalid data type', async () => {
    // Arrange
    await UserTableTestHelper.addUser({ role: 'admin' });
    const requestPayload = {
      name: 'Product D',
      description: 'Description of Product D',
      price: 'not-a-number', // invalid price
      stock: 10,
    };
    const server = await createServer(container);

    // Action
    const response = await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${await ProductsTableTestHelper.generateMockToken()}`)
      .send(requestPayload);

    // Assert
    const responseJson = response.body;

    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
  });
  it('should response 400 when request payload has negative price and stock', async () => {
    // Arrange
    await UserTableTestHelper.addUser({ role: 'admin' });
    const requestPayload = {
      name: 'Product E',
      description: 'Description of Product E',
      price: -50000,
      stock: -5, // negative stock
    };
    const server = await createServer(container);

    // Action
    const response = await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${await ProductsTableTestHelper.generateMockToken()}`)
      .send(requestPayload);

    // Assert
    const responseJson = response.body;

    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
  });
});
