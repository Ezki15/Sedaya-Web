/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const UserTableTestHelper = {
  async addUser({
    id = 'user-123',
    fullname = 'User App',
    username = 'userapp',
    email = 'user@gmail.com',
    password = 'Rahasia',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5)',
      values: [id, fullname, username, email, password],
    };

    await pool.query(query);
  },

  async findUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROm users WHERE 1=1');
  },
};

export default UserTableTestHelper;
