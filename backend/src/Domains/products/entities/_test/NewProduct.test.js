import NewProduct from '../NewProduct.js';

describe('a new product entities', () => {
  it('should throw error when payload did not contain needed propert', () => {
    // Arrange
    const payload = {
      description: 'Televisi amoled new gen',
      price: 20000000,
      stock: 20,
    };

    // Action and Assert
    expect(() => new NewProduct(payload)).toThrow('NEW_PRODUCT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      name: 1123455,
      description: 'Televisi amoled new gen',
      price: 20000000,
      stock: 20,
    };

    // Action and Assert
    expect(() => new NewProduct(payload)).toThrow('NEW_PRODUCT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when stock value is negative', () => {
    // Arrange
    const payload = {
      name: 'Televisi',
      description: 'Televisi amoled new gen',
      price: -20000000,
      stock: -20,
    };

    // Action and Assert
    expect(() => new NewProduct(payload)).toThrow('NEW_PRODUCT.STOCK_AND_PRICE_VALUE_SHOULD_NOT_BE_NEGATIVE');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      name: 'Televisi',
      description: 'Televisi amoled new gen',
      price: 20000000,
      stock: 20,
    };

    const imagePathUpload = 'uploads/products/image.jpg';

    // Action
    const {
      name, description, price, stock, imagePath,
    } = new NewProduct(payload, imagePathUpload);

    // Assert
    expect(name).toEqual(payload.name);
    expect(description).toEqual(payload.description);
    expect(price).toEqual(payload.price);
    expect(stock).toEqual(payload.stock);
    expect(imagePath).toEqual(imagePathUpload);
  });
});
