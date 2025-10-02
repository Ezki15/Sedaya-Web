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
    const initialValue = false;
    const query = {
      text: 'SELECT * FROM products WHERE id = $1 AND is_deleted = $2',
      values: [id, initialValue],
    };
    const result = await pool.query(query);

    return result.rows;
  },

  async generateMockToken({ id = 'user-123', email = 'user@gmail.com', role = 'user' }) {
    const payload = {
      id,
      email,
      role,
    };
    return Jwt.sign(payload, process.env.ACCESS_TOKEN_KEY);
  },

  async cleanTable() {
    await pool.query('DELETE FROM products WHERE 1=1');
  },

};

export default ProductsTableTestHelper;
