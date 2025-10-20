/* eslint-disable max-len */
import ProductRepository from '../../../Domains/products/ProductRepository.js';
import GetSingleProductUseCase from '../GetSingleProductUseCase.js';

describe('GetProductsUseCase', () => {
  it('should orchestrate the get products use case correctly', async () => {
    // Arrange
    const mockProducts = {
      id: 'product-1',
      name: 'Product 1',
      description: 'Description of Product 1',
      price: 100,
      stock: 50,
      imagePath: 'uploads/products/image-1.jpg',
    };

    const productId = 'product-1';

    const mockProductRepository = new ProductRepository();
    mockProductRepository.validateAvailableProduct = jest.fn().mockImplementation(() => Promise.resolve());
    mockProductRepository.getProductById = jest.fn().mockResolvedValue(mockProducts);

    const getSingleProductUseCase = new GetSingleProductUseCase({
      productRepository: mockProductRepository,
    });

    // Act
    const product = await getSingleProductUseCase.execute(productId);

    // Assert
    expect(product).toEqual(mockProducts);
    expect(mockProductRepository.getProductById).toHaveBeenCalled();
  });

  it('should throw error when use case not contain needed argument', async () => {
    // Arrange
    const productId = '';
    const getSingleProductUseCase = new GetSingleProductUseCase({});

    // Action & assert
    await expect(getSingleProductUseCase.execute(productId)).rejects.toThrow('GET_SINGLE_PRODUCT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when argument not meet data type specification', async () => {
    // Arrange
    const productId = 123; // Invalid type, should be a string
    const getSingleProductUseCase = new GetSingleProductUseCase({});

    // Action & assert
    await expect(getSingleProductUseCase.execute(productId)).rejects.toThrow('GET_SINGLE_PRODUCT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when prodcut is not available', async () => {
    // Arrange
    const productId = 'product-123';
    const mockProductRepository = new ProductRepository();
    mockProductRepository.validateAvailableProduct = jest.fn().mockImplementation(() => {
      throw new Error('Product tidak ada');
    });
    const getSingleProductUseCase = new GetSingleProductUseCase({
      productRepository: mockProductRepository,
    });

    // Action & assert
    await expect(getSingleProductUseCase.execute(productId)).rejects.toThrow('Product tidak ada');
  });
});
