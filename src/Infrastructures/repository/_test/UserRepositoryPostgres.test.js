import UsersTableTestHelper from '../../../../test/UsersTableTestHelper';
import InvariantError from '../../../Commons/exceptions/InvariantError';
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

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'userapp' }); // memasukan user baru dengan username userapp
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('userapp')).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('userapp')).resolves.not.toThrow(InvariantError);
    });
  });


  describe('verifyAvailableEmail function', () => {
    it('should throw InvariantError when email not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ email: 'user@gmail.com' }); // memasukan user baru dengan email user@gmail.com
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableEmail('user@gmail.com')).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when email available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableEmail('user@gmail.com')).resolves.not.toThrow(InvariantError);
    });
  });


});
