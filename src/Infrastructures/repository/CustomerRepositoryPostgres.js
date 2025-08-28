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
}

export default CustomerRepositorPostgres;
