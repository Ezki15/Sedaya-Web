/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class LoginUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { email, password } = payload;

    this.email = email;
    this.password = password;
  }

  _verifyPayload(payload) {
    const { email, password } = payload;

    if (!email || !password) {
      throw new Error('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default LoginUser;
