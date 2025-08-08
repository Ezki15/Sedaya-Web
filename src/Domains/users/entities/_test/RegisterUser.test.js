import RegisterUser from '../RegisterUser';

describe('a RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      fullname: 'name-123',
      email: 'email123@gmail.com',
      password: 'pass-123',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      fullname: 'name-123',
      username: 'username',
      email: 123,
      password: 'pass-123',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload username contains restricted character', () => {
    // Arrange
    const payload = {
      fullname: 'name-123',
      username: 'user name',
      email: 'email123@gmail.com',
      password: 'pass-123',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });

  it('should throw error when username contains more than 50 character', () => {
    // Arrange
    const payload = {
      fullname: 'Dicoding Indonesia',
      username: 'abogoboajsjdhahajshdjdustakalibotakkapalselamdenganmembawaparangditanganhs',
      email: 'email123@gmail.com',
      password: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_LIMIT_CHAR');
  });

  it('should create resgisterUser object correctly', () => {
    // Arrange
    const payload = {
      fullname: 'name-123',
      username: 'username',
      email: 'email123@gmail.com',
      password: 'pass-123',
    };

    // Action
    const {
      fullname, username, email, password,
    } = new RegisterUser(payload);

    // Assert
    expect(fullname).toEqual(payload.fullname);
    expect(username).toEqual(payload.username);
    expect(email).toEqual(payload.email);
    expect(password).toEqual(payload.password);
  });

  it('should create resgisterUser object correctly with admin role', () => {
    // Arrange
    const payload = {
      fullname: 'name-123',
      username: 'username',
      email: 'email123@gmail.com',
      password: 'pass-123',
      role: 'admin',
    };

    // Action
    const {
      fullname, username, email, password, role,
    } = new RegisterUser(payload);

    // Assert
    expect(fullname).toEqual(payload.fullname);
    expect(username).toEqual(payload.username);
    expect(email).toEqual(payload.email);
    expect(password).toEqual(payload.password);
    expect(role).toEqual(payload.role);
    expect(role).toEqual('admin'); // Ensure role is set to 'admin'
  });
});
