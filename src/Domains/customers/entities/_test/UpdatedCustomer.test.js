import UpdatedCustomer from '../UpdatedCustomer.js';

describe('an update customer entities', () => {
  it('should throw error when payload did not contain needed propert', () => {
    // Arrange
    const payload = {
      name: 'Customer 1',
      email: 'customer@gmail.com',
      phone: '083948574635',
    // address is missing
    };
    const userId = 'user-123';

    // Action and Assert
    expect(() => new UpdatedCustomer(payload, userId)).toThrow('UPDATED_CUSTOMER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      name: 'Customer 1',
      email: 'customer@gmail.com',
      phone: '083948574635',
      address: 12345,
    };
    const userId = 'user-123';

    // Action and Assert
    expect(() => new UpdatedCustomer(payload, userId)).toThrow('UPDATED_CUSTOMER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create updateCustomer object correctly', () => {
    // Arrange
    const payload = {
      name: 'Customer 1',
      email: 'customer@gmail.com',
      phone: '083948574635',
      address: 'Lombok',
    };
    const userId = 'user-123';

    // Action
    const {
      name, email, phone, address, userId: owner,
    } = new UpdatedCustomer(payload, userId);

    // Assert

    expect(name).toEqual(payload.name);
    expect(email).toEqual(payload.email);
    expect(phone).toEqual(payload.phone);
    expect(address).toEqual(payload.address);
    expect(owner).toEqual(userId);
  });
});
