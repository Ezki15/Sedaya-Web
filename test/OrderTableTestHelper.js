/* eslint-disable max-len */
/* istanbul ignore file */

import Jwt from 'jsonwebtoken';
import pool from '../src/Infrastructures/database/postgres/pool.js';

const OrderTableTestHelper = {
  async addOrder({
    id = 'order-123',
    userId = 'user-123',
    quantity = 1,
    totalPrice = 100000,
    status = 'pending',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
    isDeleted = false, // Default value for is_deleted
  }) {
    const query = {
      text: 'INSERT INTO orders VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      values: [id, userId, quantity, totalPrice, status, createdAt, updatedAt, isDeleted],
    };

    await pool.query(query);
  },
  async findOrderById(id) {
    const initialValue = false;
    const query = {
      text: 'SELECT * FROM orders WHERE id = $1 AND is_deleted = $2',
      values: [id, initialValue],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async generateMockToken(id = 'user-123', username = 'userapp') {
    const payload = {
      id,
      username,
    };
    return Jwt.sign(payload, process.env.ACCESS_TOKEN_KEY);
  },

  async cleanTable() {
    await pool.query('DELETE FROM orders WHERE 1=1');
  },
};

export default OrderTableTestHelper;
