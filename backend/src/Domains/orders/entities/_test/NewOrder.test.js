import NewOrder from '../NewOrder.js';

describe('a new order entities', () => {
  it('should throw error when payload (array) did not contain needed property', () => {
    // Arrange
    const payload = [];
    const totalPrice = 0; // Example total price
    const owner = 'user-123';

    // Action and Assert
    expect(() => new NewOrder(payload, totalPrice, owner)).toThrow('NEW_ORDER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = [
      {
        productId: 123456,
        quantity: 'two',
        price: 10000,
      },
    ];
    const totalPrice = 200000; // Example total price
    const owner = 'user-123';

    // Action and Assert
    expect(() => new NewOrder(payload, totalPrice, owner)).toThrow('NEW_ORDER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when quantity value is negative', () => {
    // Arrange
    const payload = [
      {
        productId: 'product-123',
        quantity: -2,
        price: 200000,
      },
    ];

    const totalPrice = 30000; // Example total price
    const owner = 'user-123';

    // Action and Assert
    expect(() => new NewOrder(payload, totalPrice, owner)).toThrow('NEW_ORDER.QUANTITY_SHOULD_NOT_BE_NEGATIVE');
  });

  it('should create new order object correctly', () => {
    // Arrange
    const payload = [
      {
        productId: 'product-123',
        quantity: 2,
        price: 10000,
      },
    ];
    const userId = 'user-123';
    const totalPrice = 20000; // Example total price

    // Action
    const newOrder = new NewOrder(payload, totalPrice, userId);

    // Assert
    expect(newOrder.products).toHaveLength(1);
    expect(newOrder.products[0]).toHaveProperty('productId', payload[0].productId);
    expect(newOrder.products[0]).toHaveProperty('quantity', payload[0].quantity);
  });
});
