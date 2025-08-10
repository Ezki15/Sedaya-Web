/* istanbul ignore file */

import Jwt from 'jsonwebtoken';
import pool from '../src/Infrastructures/database/postgres/pool.js';

const ProductsTableTestHelper = {
  async addProduct({
    id = 'product-123',
    name = 'Product Name',
    description = 'Product Description',
    price = 100000,
    stock = 50,
    isDeleted = false,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO products VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
      values: [id, name, description, price, stock, isDeleted, createdAt, updatedAt],
    };

    await pool.query(query);
  },

  async findProductById(id) {
    const query = {
      text: 'SELECT * FROM products WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return null;
    }
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
    await pool.query('DELETE FROM products WHERE 1=1');
  },

};

export default ProductsTableTestHelper;
