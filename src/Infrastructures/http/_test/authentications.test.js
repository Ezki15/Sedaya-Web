import pool from '../../database/postgres/pool.js';
import request from 'supertest';
import UsersTableTestHelper from '../../../../test/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../test/AuthenticationsTableTestHelper.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';
import container from '../../container.js';
import createServer from '../CreateServer.js';

describe('/authentications endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /authentication ', () => {
    it('should response 201 and new authentication', async () => {
      // Arrange
      const requestPayload = {
        email: 'user@gmail.com',
        password: 'secretpassword',
      };
      const server = await createServer(container);
      // add user
      await request(server)
        .post('/auth/users/register')
        .send({
          fullname: 'User App',
          username: 'userapp',
          email: 'user@gmail.com',
          password: 'secretpassword',
        });

      // Action
      const response = await request(server)
        .post('/authentications')
        .send(requestPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });

    it('should response 400 if email not found', async () => {
    // Arrange
      const requestPayload = {
        email: 'app@gmail.com',
        password: 'secretpassword',
      };
      const server = await createServer(container);
      // add user
      await request(server)
        .post('/auth/users/register')
        .send({
          fullname: 'User App',
          username: 'userapp',
          email: 'user@gmail.com',
          password: 'secretpassword',
        });

      // Action
      const response = await request(server)
        .post('/authentications')
        .send(requestPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('email tidak ditemukan');
    });

    it('should response 401 if password wrong', async () => {
      // Arrange
      const requestPayload = {
        email: 'user@gmail.com',
        password: 'password',
      };
      const server = await createServer(container);
      // add user
      await request(server)
        .post('/auth/users/register')
        .send({
          fullname: 'User App',
          username: 'userapp',
          email: 'user@gmail.com',
          password: 'secretpassword',
        });

      // Action
      const response = await request(server)
        .post('/authentications')
        .send(requestPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('kredensial yang Anda masukkan salah');
    });

    it('should response 400 if login payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        email: 'app@gmail.com',
      };
      const server = await createServer(container);
      // add user
      await request(server)
        .post('/auth/users/register')
        .send({
          fullname: 'User App',
          username: 'userapp',
          email: 'user@gmail.com',
          password: 'secretpassword',
        });

      // Action
      const response = await request(server)
        .post('/authentications')
        .send(requestPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan email dan password');
    });

    it('should response 400 if login payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        email: 12345,
        password: 'secretpassword',
      };
      const server = await createServer(container);
      // add user
      await request(server)
        .post('/auth/users/register')
        .send({
          fullname: 'User App',
          username: 'userapp',
          email: 'user@gmail.com',
          password: 'secretpassword',
        });

      // Action
      const response = await request(server)
        .post('/authentications')
        .send(requestPayload);

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('email dan password harus string');
    });
  });

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      await request(server)
        .post('/auth/users/register')
        .send({
          fullname: 'User App',
          username: 'userapp',
          email: 'user@gmail.com',
          password: 'secretpassword',
        });

     // login user
      const loginResponse = await request(server)
      .post('/authentications')
      .send({
        email: 'user@gmail.com',
        password: 'secretpassword',
      });

      const { data: { refreshToken } } = loginResponse.body;

      // Action
      const response = await request(server)
        .put('/authentications')
        .send({
          refreshToken,
        });
      
      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .put('/authentications')
        .send({
          // no refreshToken provided
        });
      
      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan token refresh');
    });

    it('should return 400 if refresh token not string', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .put('/authentications')
        .send({
          refreshToken: 12345,
        });
      
      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus string');
    });

    it('should return 400 if refresh token not valid', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .put('/authentications')
        .send({
          refreshToken: 'invalid_refresh_token', // intentionally invalid token
        });
      
      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should return 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = await createServer(container);
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ username: 'userapp' });

      // Action
      const response = await request(server)
        .put('/authentications')
        .send({
          refreshToken,
        });

      // Assert
      const responseJson = response.body;
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });
  });

//   describe('when DELETE /authentications', () => {
//     it('should response 200 if refresh token valid', async () => {
//       // Arrange
//       const server = await createServer(container);
//       const refreshToken = 'refresh_token';
//       await AuthenticationsTableTestHelper.addToken(refreshToken);

//       // Action
//       const response = await server.inject({
//         method: 'DELETE',
//         url: '/authentications',
//         payload: {
//           refreshToken,
//         },
//       });

//       // Assert
//       const responseJson = JSON.parse(response.payload);
//       expect(response.statusCode).toEqual(200);
//       expect(responseJson.status).toEqual('success');
//     });

//     it('should response 400 if refresh token not registered in database', async () => {
//       // Arrange
//       const server = await createServer(container);
//       const refreshToken = 'refresh_token';

//       // Action
//       const response = await server.inject({
//         method: 'DELETE',
//         url: '/authentications',
//         payload: {
//           refreshToken,
//         },
//       });

//       // Assert
//       const responseJson = JSON.parse(response.payload);
//       expect(response.statusCode).toEqual(400);
//       expect(responseJson.status).toEqual('fail');
//       expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
//     });

//     it('should response 400 if payload not contain refresh token', async () => {
//       // Arrange
//       const server = await createServer(container);

//       // Action
//       const response = await server.inject({
//         method: 'DELETE',
//         url: '/authentications',
//         payload: {},
//       });

//       const responseJson = JSON.parse(response.payload);
//       expect(response.statusCode).toEqual(400);
//       expect(responseJson.status).toEqual('fail');
//       expect(responseJson.message).toEqual('harus mengirimkan token refresh');
//     });

//     it('should response 400 if refresh token not string', async () => {
//       // Arrange
//       const server = await createServer(container);

//       // Action
//       const response = await server.inject({
//         method: 'DELETE',
//         url: '/authentications',
//         payload: {
//           refreshToken: 123,
//         },
//       });

//       const responseJson = JSON.parse(response.payload);
//       expect(response.statusCode).toEqual(400);
//       expect(responseJson.status).toEqual('fail');
//       expect(responseJson.message).toEqual('refresh token harus string');
//     });
//   });
});
