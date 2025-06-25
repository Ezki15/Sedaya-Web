/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class RegisterUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      fullname, username, email, password,
    } = payload;

    this.fullname = fullname;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  _verifyPayload({
    fullname, username, email, password,
  }) {
    if (!username || !password || !fullname || !email) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string' || typeof email !== 'string') {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }
  }
}

export default RegisterUser;
