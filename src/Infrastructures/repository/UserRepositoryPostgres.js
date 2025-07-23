import InvariantError from '../../Commons/exceptions/InvariantError';
import RegisteredUser from '../../Domains/users/entities/RegisteredUser';
import UserRepository from '../../Domains/users/UserRepository';

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addUser(registerUser) {
    const {
      fullname, username, email, password,
    } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id, fullname, username',
      values: [id, fullname, username, email, password],
    };

    const result = await this._pool.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }
}

export default UserRepositoryPostgres;
