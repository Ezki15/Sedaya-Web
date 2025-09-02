import LoginUser from '../LoginUser';

describe('LoginUser', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      password: 'password123',
    };

    // Action & Assert
    expect(() => new LoginUser(payload)).toThrow('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type requirements', () => {
    // Arrange
    const payload = {
      email: 12345,
      password: 'password123', // Invalid type
    };

    // Action & Assert
    expect(() => new LoginUser(payload)).toThrow('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create LoginUser object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      email: 'kipli123@gmail.com',
      password: 'password123',
    };

    // Action
    const loginUser = new LoginUser(payload);

    // Assert
    expect(loginUser.email).toEqual(payload.email);
    expect(loginUser.password).toEqual(payload.password);
    expect(loginUser).toBeInstanceOf(LoginUser);
  });
});
