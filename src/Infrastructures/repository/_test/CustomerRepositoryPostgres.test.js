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
});
