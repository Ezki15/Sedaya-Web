import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../test/UsersTableTestHelper.js';
import CustomerTableTestHelper from '../../../../test/CustomersTableTesthelper.js';
import createServer from '../CreateServer.js';
import container from '../../container.js';

describe(' /customers endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CustomerTableTestHelper.cleanTable();
  });

  describe('when POST /customers', () => {
    it('should response 201 and persisted customer', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const requestPayload = {
        name: 'User App',
        email: 'user@gmail.com',
        phone: '6283764526837',
        address: 'Malang',
      };

      const server = await createServer(container);

      //   Action
      const response = await request(server)
        .post('/customers')
        .set('Authorization', `Bearer ${await CustomerTableTestHelper.generateMockToken()}`) // assuming a valid token is used
        .send(requestPayload);

      // Assert
      const responseJson = response.body;

      // console.log(responseJson);

      expect(response.statusCode).toBe(201);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
    });

    it('should response 401 when no authentication token is provided', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const requestPayload = {
        name: 'User App',
        email: 'user@gmail.com',
        phone: '6283764526837',
        address: 'Malang',
      };

      const server = await createServer(container);

      //   Action
      const response = await request(server)
        .post('/customers')
        // No auth token
        .send(requestPayload);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toBe(401);
      expect(responseJson.status).toBe('fail');
    });

    it('should reponse 400 when request payload not contain needed property', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const requestPayload = {
        name: 'User App',
        email: 'user@gmail.com',
        // phone: '6283764526837',
        address: 'Malang',
      };

      const server = await createServer(container);

      //   Action
      const response = await request(server)
        .post('/customers')
        .set('Authorization', `Bearer ${await CustomerTableTestHelper.generateMockToken()}`) // assuming a valid token is used
        .send(requestPayload);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toBe(400);
      expect(responseJson.status).toBe('fail');
    });

    it('should reponse 400 when request payload has invalid data type', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const requestPayload = {
        name: 'User App',
        email: 'user@gmail.com',
        phone: '6283764526837',
        address: 2345,
      };

      const server = await createServer(container);

      //   Action
      const response = await request(server)
        .post('/customers')
        .set('Authorization', `Bearer ${await CustomerTableTestHelper.generateMockToken()}`) // assuming a valid token is used
        .send(requestPayload);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toBe(400);
      expect(responseJson.status).toBe('fail');
    });
  });

  describe('when GET /customers', () => {
    it('should return all customers correctly', async () => {
      // Arrange
      // Create user and admin
      await UsersTableTestHelper.addUser({
        id: 'user-234', fullname: 'Admin App', username: 'admin', email: 'admin@gmail.com', role: 'admin',
      });
      await UsersTableTestHelper.addUser({}); // User as customer
      await UsersTableTestHelper.addUser({
        id: 'user-124', fullname: 'Jhoni', username: 'jhoniband', email: 'jhon@gmail.com',
      });
      // create customer
      await CustomerTableTestHelper.addCustomer({});
      await CustomerTableTestHelper.addCustomer({
        id: 'customer-124',
        userId: 'user-124',
        name: 'Jhoni',
        email: 'jhone@gmail.com',
        phone: '083492847363',
        address: 'Lombok Barat',
      });

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .get('/customers')
        .set('Authorization', `Bearer ${await CustomerTableTestHelper.generateMockToken('user-234', 'admin')}`);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
