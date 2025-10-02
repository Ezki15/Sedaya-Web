/* istanbul ignore file */

import Jwt from 'jsonwebtoken';
import pool from '../src/Infrastructures/database/postgres/pool.js';

const CustomerTableTestHelper = {
  async addCustomer({
    id = 'customer-123',
    userId = 'user-123',
    name = 'User App',
    email = 'user@gmail.com',
    phone = '6282338765456',
    address = 'Lombok Timur',
    isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO customers VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, userId, name, email, phone, address, isDeleted],
    };

    await pool.query(query);
  },

  async findCustomerById(id) {
    const initialValue = false;
    const query = {
      text: 'SELECT * FROM customers WHERE id = $1 AND is_deleted = $2',
      values: [id, initialValue],
    };
    const result = await pool.query(query);

    return result.rows;
  },

  async generateMockToken({ id = 'user-123', email = 'userapp@gmail.com', role = 'user' }) {
    const payload = {
      id,
      email,
      role,
    };
    return Jwt.sign(payload, process.env.ACCESS_TOKEN_KEY);
  },

  async cleanTable() {
    await pool.query('DELETE FROm customers WHERE 1=1');
  },
};

export default CustomerTableTestHelper;
