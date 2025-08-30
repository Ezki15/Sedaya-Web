import crypto from 'crypto';
import UsersTableTestHelper from '../../../../test/UsersTableTestHelper.js';
import CustomersTableTestHelper from '../../../../test/CustomersTableTesthelper.js';
import pool from '../../database/postgres/pool.js';
import NewCustomer from '../../../Domains/customers/entities/NewCustomer.js';
import CustomerRepositoryPostgres from '../CustomerRepositoryPostgres';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('CustomerRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CustomersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCustomer function', () => {
    it('should persist new customer', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const userId = 'user-123';
      const payload = {
        name: 'User App',
        email: 'user@gamil.com',
        phone: '6287656537827',
        address: 'Lombok',
      };
      const newCustomer = new NewCustomer(payload, userId);
      const fakeIdGenerator = () => '123';
      const customerRepository = new CustomerRepositoryPostgres(pool, fakeIdGenerator);

      //   Action
      await customerRepository.addCustomer(newCustomer);

      // Assert
      const customer = await CustomersTableTestHelper.findCustomerById('customer-123');
      expect(customer).toHaveLength(1);
    });
  });

  describe('getAllCustomers function', () => {
    it('should persist all customers', async () => {
      // Arrange
      const Customer1 = {
        name: 'Jhoni',
        email: 'jhone@gmail.com',
        phone: '083492847363',
        address: 'Lombok Timur,',
      };
      const userId1 = 'user123';
      const newCustomer1 = new NewCustomer(Customer1, userId1);

      const Customer2 = {
        name: 'David',
        email: 'david@gmail.com',
        phone: '0823849387498',
        address: 'Lombok Barat,',
      };
      const userId2 = 'user234';
      const newCustomer2 = new NewCustomer(Customer2, userId2);

      // Create user
      await UsersTableTestHelper.addUser({
        id: userId1, fullname: 'Jhoni', username: 'jhoniband', email: Customer1.email,
      });
      await UsersTableTestHelper.addUser({
        id: userId2, fullname: 'David', username: 'davide', email: Customer2.email,
      });

      const fakeIdGenerator = () => crypto.randomBytes(10).toString('hex');
      const customerRepository = new CustomerRepositoryPostgres(pool, fakeIdGenerator);

      // Create customer
      await customerRepository.addCustomer(newCustomer1);
      await customerRepository.addCustomer(newCustomer2);

      // Action
      const customers = await customerRepository.getAllCustomers();

      // Assert
      expect(customers).toHaveLength(2);
      expect(customers[0]).toHaveProperty('id');
      expect(customers[1]).toHaveProperty('id');
    });
  });

  describe('validateAvailableCustomer function', () => {
    it('should not throw error if customer is available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user123' });
      const Customer1 = {
        name: 'Jhoni',
        email: 'jhone@gmail.com',
        phone: '083492847363',
        address: 'Lombok Timur',
      };
      const userId1 = 'user123';
      const newCustomer1 = new NewCustomer(Customer1, userId1);

      const fakeIdGenerator = () => '123';
      const customerRepository = new CustomerRepositoryPostgres(pool, fakeIdGenerator);

      await customerRepository.addCustomer(newCustomer1);

      // Action & Assert
      await expect(customerRepository.validateAvailableCustomer('customer-123')).resolves.not.toThrow();
    });

    it('should throw NotFoundError if customer is not available', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const customerRepository = new CustomerRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(customerRepository.validateAvailableCustomer('customer-999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getCustomerById function', () => {
    it('should return customer by id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await CustomersTableTestHelper.addCustomer({
        id: 'customer-123',
        userId: 'user-123', // same as id from users
        name: 'Jhoni',
        email: 'jhone@gmail.com',
        phone: '083492847363',
        address: 'Lombok Timur',
      });
      const customerId = 'customer-123';
      const fakeIdGenerator = () => '123';
      const customerRepository = new CustomerRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const customer = await customerRepository.getCustomerById(customerId);

      // Assert
      expect(customer).toEqual({
        id: 'customer-123',
        name: 'Jhoni',
        email: 'jhone@gmail.com',
        phone: '083492847363',
        address: 'Lombok Timur',
      });
    });

    it('should throw NotFoundError if customer does not exist with is_deleted is true', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await CustomersTableTestHelper.addCustomer({
        id: 'customer-123',
        userId: 'user-123',
        name: 'Jhoni',
        email: 'jhone@gmail.com',
        phone: '083492847363',
        address: 'Lombok Timur',
        isDeleted: true,
      });
      const fakeIdGenerator = () => '123';
      const customerRepository = new CustomerRepositoryPostgres(pool, fakeIdGenerator);
      const customerId = 'customer-123';

      // Action & Assert
      await expect(customerRepository.getCustomerById(customerId)).rejects.toThrow(NotFoundError);
    });
  });
});
