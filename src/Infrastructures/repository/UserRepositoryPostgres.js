import InvariantError from '../../Commons/exceptions/InvariantError.js';
import RegisteredUser from '../../Domains/users/entities/RegisteredUser.js';
import UserRepository from '../../Domains/users/UserRepository.js';

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addUser(registerUser) {
    const {
      fullname, username, email, password, role,
    } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id, fullname, username',
      values: [id, fullname, username, email, password, role],
    };

    const result = await this._pool.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async verifyAvailableEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('email tidak tersedia');
    }
  }

  async getPasswordByEmail(email) {
    const query = {
      text: 'SELECT password FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('email tidak ditemukan');
    }
    return result.rows[0].password;
  }

  async getIdByEmail(email) {
    const query = {
      text: 'SELECT id FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('email tidak ditemukan');
    }
    return result.rows[0].id;
  }

  async verifyAdmin(userId) {
    const query = {
      text: 'SELECT role FROM users WHERE id = $1 ',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0 || result.rows[0].role !== 'admin') {
      throw new InvariantError('hak akses dibatasi');
    }
  }
}

export default UserRepositoryPostgres;
