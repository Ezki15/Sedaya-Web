import RegisteredUser from '../RegisteredUser';

describe('RegisteredUser entities', () => {
  it('should throw error when payload did not contain required properties', () => {
    const payload = {
      id: 'user-123',
      username: 'john_doe',
    };
    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specifications', () => {
    const payload = {
      id: 'user-123',
      username: 'john_doe',
      fullname: {},
    };
    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RegisteredUser entity correctly', () => {
    const payload = {
      id: 'user-123',
      username: 'john_doe',
      fullname: 'John Doe',
    };

    // Action
    const registeredUser = new RegisteredUser(payload);

    // Assert
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.fullname).toEqual(payload.fullname);
    expect(registeredUser.username).toEqual(payload.username);
  });
});
