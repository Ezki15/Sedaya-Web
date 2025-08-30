import crypto from 'crypto';
import UsersTableTestHelper from '../../../../test/UsersTableTestHelper.js';
import CustomersTableTestHelper from '../../../../test/CustomersTableTesthelper.js';
import pool from '../../database/postgres/pool.js';
import NewCustomer from '../../../Domains/customers/entities/NewCustomer.js';
import CustomerRepositorPostgres from '../CustomerRepositoryPostgres';

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
      const customerRepository = new CustomerRepositorPostgres(pool, fakeIdGenerator);

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
      const customerRepository = new CustomerRepositorPostgres(pool, fakeIdGenerator);

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
});
