import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../test/UsersTableTestHelper.js';
import CustomersTableTestHelper from '../../../../test/CustomersTableTesthelper.js';
import createServer from '../CreateServer.js';
import container from '../../container.js';

describe(' /customers endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CustomersTableTestHelper.cleanTable();
  });

  describe('when POST /customers', () => {
    it('should response 201 and persisted customer', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', email: 'userapp@gmail.com' });
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
        .set('Cookie', `accessToken=${await CustomersTableTestHelper.generateMockToken({ id: 'user-123', email: 'userapp@gmail.com' })}`) // assuming a valid token is used
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
      await UsersTableTestHelper.addUser({ id: 'user-123', email: 'userapp@gmail.com' });
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
      await UsersTableTestHelper.addUser({ id: 'user-123', email: 'userapp@gmail.com' });
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
        .set('Cookie', `accessToken=${await CustomersTableTestHelper.generateMockToken({ id: 'user-123', email: 'userapp@gmail.com' })}`) // assuming a valid token is used
        .send(requestPayload);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toBe(400);
      expect(responseJson.status).toBe('fail');
    });

    it('should reponse 400 when request payload has invalid data type', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', email: 'userapp@gmail.com' });
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
        .set('Cookie', `accessToken=${await CustomersTableTestHelper.generateMockToken({ id: 'user-123', email: 'userapp@gmail.com' })}`) // assuming a valid token is used
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
      await CustomersTableTestHelper.addCustomer({});
      await CustomersTableTestHelper.addCustomer({
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
        .set('Cookie', `accessToken=${await CustomersTableTestHelper.generateMockToken({ id: 'user-234', email: 'admin@gmail.com', role: 'admin' })}`);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when GET /customers/:id', () => {
    it('should return all customers correctly', async () => {
      // Arrange
      // Create user
      await UsersTableTestHelper.addUser({ id: 'user-123', email: 'userapp@gmail.com' }); // User as customer
      await UsersTableTestHelper.addUser({
        id: 'user-124', fullname: 'Jhoni', username: 'jhoniband', email: 'jhon@gmail.com',
      });
      // create customer
      await CustomersTableTestHelper.addCustomer({});
      await CustomersTableTestHelper.addCustomer({
        id: 'customer-124',
        userId: 'user-124',
        name: 'Jhoni',
        email: 'jhone@gmail.com',
        phone: '083492847363',
        address: 'Lombok Barat',
      }); // customer doesn't we look at

      const customerId = 'customer-123';
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .get(`/customers/${customerId}`)
        .set('Cookie', `accessToken=${await CustomersTableTestHelper.generateMockToken({ id: 'user-123', email: 'userapp@gmail.com' })}`);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
    it('should return 404 when customer not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .get('/customers/non-existing-id')
        .set('Cookie', `accessToken=${await CustomersTableTestHelper.generateMockToken({})}`);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });

  describe('when PUT /customers/:id', () => {
    it('should update customer and return 200', async () => {
      // Arrange
      const userId = 'user-123';
      const customerId = 'customer-123'; // Mock customer ID, replace with actual ID
      await UsersTableTestHelper.addUser({ id: userId, username: 'userapp' });
      await CustomersTableTestHelper.addCustomer({ id: customerId });
      const requestPayload = {
        name: 'Updated Customer',
        email: 'customer@gmail.com',
        phone: '087645376829',
        address: 'Lombok Baru',
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .put(`/customers/${customerId}`)
        .set('Cookie', `accessToken=${await CustomersTableTestHelper.generateMockToken({ id: 'user-123', email: 'userapp@gmail.com' })}`)
        .send(requestPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });

    it('should return 404 when customer not found', async () => {
      // Arrange
      const customerId = 'non-existing-id'; // Mock non-existing customer ID
      const requestPayload = {
        name: 'Updated Customer',
        email: 'customer@gmail.com',
        phone: '087645376829',
        address: 'Lombok Baru',
      };
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId, email: 'userapp@gmail.com' });
      const server = await createServer(container);
      // Action
      const response = await request(server)
        .put(`/customers/${customerId}`)
        .set('Cookie', `accessToken=${await CustomersTableTestHelper.generateMockToken({ id: userId, email: 'userapp@gmail.com' })}`)
        .send(requestPayload);
      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Customer tidak ada');
    });
  });

  describe('when DELETE /customers/:id', () => {
    it('should delete customer and return 200', async () => {
      // Arrange
      const customerId = 'customer-123'; // Mock customer ID, replace with actual ID
      await UsersTableTestHelper.addUser({ id: 'user-123', email: 'userapp@gmail.com', role: 'admin' }); // Ensure an admin user exists
      await CustomersTableTestHelper.addCustomer({ id: customerId, isDeleted: true });
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .delete(`/customers/${customerId}`)
        .set('Cookie', `accessToken=${await CustomersTableTestHelper.generateMockToken({ id: 'user-123', email: 'userapp@gmail.com', role: 'admin' })}`);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should return 404 when customer not found', async () => {
      // Arrange
      const customerId = 'non-existing-id'; // Mock non-existing customer ID
      await UsersTableTestHelper.addUser({ id: 'user-123', email: 'userapp@gmail.com', role: 'admin' }); // Ensure an admin user exists
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .delete(`/customers/${customerId}`)
        .set('Cookie', `accessToken=${await CustomersTableTestHelper.generateMockToken({ id: 'user-123', email: 'userapp@gmail.com', role: 'admin' })}`);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
