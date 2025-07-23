import UsersTableTestHelper from '../../../../test/UsersTableTestHelper';
import InvarianError from '../../../Commons/exceptions/InvariantError';
import RegisterUser from '../../../Domains/users/entities/RegisterUser';
import pool from '../../database/postgres/pool';
import UserRepositoryPostgres from '../UserRepositoryPostgres';

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addUser', () => {
    it('should persist register user and return data correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        fullname: 'User App',
        username: 'userapp',
        email: 'user@gmail.com',
        password: 'Rahasia',
      });

      const fakeIdGenerator = () => '123'; // stub
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUserById('user-123');
      expect(users).toHaveLength(1);
    });
  });
});
