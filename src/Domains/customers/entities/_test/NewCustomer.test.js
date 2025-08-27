import NewCustomer from '../NewCustomer.js';

describe('a NewCustomer entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      name: 'name-123',
      email: 'email123@gmail.com',
      phone: '6282338574635',
    //   address: 'Lombok Timur' /address is missing
    };

    const userId = 'user-123';

    // Action and Assert
    expect(() => new NewCustomer(payload, userId)).toThrow('NEW_CUSTOMER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      name: 1234, // should be string
      email: 'email123@gmail.com',
      phone: '6282338574635',
      address: 'Lombok Timur',
    };

    const userId = 'user-123';

    // Action and Assert
    expect(() => new NewCustomer(payload, userId)).toThrow('NEW_CUSTOMER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create resgisterUser object correctly', () => {
    // Arrange
    const payload = {
      name: 'Darmian',
      email: 'email123@gmail.com',
      phone: '6282338574635',
      address: 'Lombok Timur',
    };

    const userId = 'user-123';

    // Action
    const {
      name, email, phone, address,
    } = new NewCustomer(payload, userId);

    // Assert
    expect(name).toEqual(payload.name);
    expect(email).toEqual(payload.email);
    expect(phone).toEqual(payload.phone);
    expect(address).toEqual(payload.address);
  });
});
