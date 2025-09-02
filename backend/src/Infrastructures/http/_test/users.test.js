import request from 'supertest';
import pool from '../../database/postgres/pool';
import UsersTableTestHelper from '../../../../test/UsersTableTestHelper';
import container from '../../container';
import createServer from '../CreateServer';

describe('/users endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /auth/users/register', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'User App',
        username: 'userapp',
        email: 'user@gmail.com',
        password: 'secretpassword',
      };

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/auth/users/register')
        .send(requestPayload);

      //  Assert
      const responseJson = response.body;

      expect(response.statusCode).toBe(201);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'User App',
        username: 'userapp',
        // email is missing
        password: 'secret',
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/auth/users/register')
        .send(requestPayload);

      // Assert
      const responseJson = response.body;

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'userapp',
        email: 'user@gmail.com',
        password: 'secret',
        fullname: ['Dicoding Indonesia'],
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/auth/users/register')
        .send(requestPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'userappuserappuserappuserappuserappuserappuserappuserappuserapp',
        email: 'user@gmail.com',
        password: 'secret',
        fullname: 'User App',
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/auth/users/register')
        .send(requestPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'user@pp',
        email: 'user@gmail.com',
        password: 'secret',
        fullname: 'User App',
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/auth/users/register')
        .send(requestPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'userapp' });
      const requestPayload = {
        username: 'userapp',
        email: 'user@gmail.com',
        fullname: 'User App',
        password: 'super_secret',
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post('/auth/users/register')
        .send(requestPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak tersedia');
    });

    it('should response 201 with role user is admin', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Admin User',
        username: 'adminuser',
        email: 'admin@gmail.com',
        password: 'adminpassword',
        role: 'admin',
      };
      const server = await createServer(container);
      // Action
      const response = await request(server)
        .post('/auth/users/register')
        .send(requestPayload);
      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toBe(201);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
    });
  });
});
