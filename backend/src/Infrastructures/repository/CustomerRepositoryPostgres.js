import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import CustomerRepository from '../../Domains/customers/CustomerRepository.js';

class CustomerRepositorPostgres extends CustomerRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCustomer(newCustomer) {
    const {
      userId, name, email, phone, address,
    } = newCustomer;
    const id = `customer-${this._idGenerator()}`;
    const isDeleted = false;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO customers VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, name',
      values: [id, userId, name, email, phone, address, isDeleted, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    // console.log(result.rows[0]);
    return result.rows[0];
  }

  async getAllCustomers() {
    const isDeleted = false;

    const query = {
      text: 'SELECT * FROM customers WHERE is_deleted = $1',
      values: [isDeleted],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
    }));
  }

  async validateAvailableCustomer(customerId) {
    const query = {
      text: 'SELECT id FROM customers WHERE id = $1',
      values: [customerId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Customer tidak ada');
    }
  }

  async getCustomerById(customerId) {
    const isDeleted = false;
    const query = {
      text: 'SELECT id, name, email, phone, address FROM customers WHERE id = $1 AND is_deleted = $2',
      values: [customerId, isDeleted],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Customer tidak ditemukan');
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
    };
  }

  async updateCustomerById(customerId, updatedCustomer) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE customers SET name = $1, email = $2, phone = $3, address = $4, updated_at = $5 WHERE id = $6 RETURNING id, name, email, phone, address',
      values: [
        updatedCustomer.name,
        updatedCustomer.email,
        updatedCustomer.phone,
        updatedCustomer.address,
        updatedAt,
        customerId,
      ],
    };

    const result = await this._pool.query(query);
    return {
      name: result.rows[0].name,
      email: result.rows[0].email,
      phone: result.rows[0].phone,
      address: result.rows[0].address,
    };
  }

  async deleteCustomerById(customerId) {
    const isDeleted = true;
    const query = {
      text: 'UPDATE customers SET is_deleted = $1 WHERE id = $2',
      values: [isDeleted, customerId],
    };

    await this._pool.query(query);
  }
}

export default CustomerRepositorPostgres;
