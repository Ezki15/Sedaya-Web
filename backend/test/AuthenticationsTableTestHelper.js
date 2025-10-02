/* istanbul ignore file */

import Jwt from 'jsonwebtoken';
import pool from '../src/Infrastructures/database/postgres/pool.js';

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

  async findToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
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
    const query = {
      text: 'DELETE FROM authentications',
    };

    await pool.query(query);
  },
};

export default AuthenticationsTableTestHelper;
