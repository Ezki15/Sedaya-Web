import UpdatedProduct from '../UpdatedProduct.js';

describe('an update product entities', () => {
  it('should throw error when payload did not contain needed propert', () => {
    // Arrange
    const payload = {
    // missing id

      description: 'Televisi amoled new gen',
      price: 20000000,
      stock: 20,
    };

    // Action and Assert
    expect(() => new UpdatedProduct(payload)).toThrow('UPDATED_PRODUCT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      name: 'Televisi amoled new gen',
      description: 'Televisi amoled new gen',
      // price should be a number, but it's a string
      price: '20000000',
      stock: 20,
    };

    // Action and Assert
    expect(() => new UpdatedProduct(payload)).toThrow('UPDATED_PRODUCT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when stock value is negative', () => {
    // Arrange
    const payload = {
      name: 'Product A',
      description: 'Desciption of Product A',
      price: -20000000,
      stock: -20,
    };

    // Action and Assert
    expect(() => new UpdatedProduct(payload)).toThrow('UPDATED_PRODUCT.STOCK_AND_PRICE_VALUE_SHOULD_NOT_BE_NEGATIVE');
  });

  it('should create updateProduct object correctly', () => {
    // Arrange
    const payload = {
      name: 'Televisi',
      description: 'Description',
      price: 20000000,
      stock: 20,
    };

    const imagePathUpload = 'uploads/images/products/xxxx.jpg';

    // Action
    const {
      name, description, price, stock, imagePath,
    } = new UpdatedProduct(payload, imagePathUpload);

    // Assert

    expect(name).toEqual(payload.name);
    expect(description).toEqual(payload.description);
    expect(price).toEqual(payload.price);
    expect(stock).toEqual(payload.stock);
    expect(imagePath).toEqual(imagePathUpload);
  });
});
