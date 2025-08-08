import ProductRepository from '../../../Domains/products/ProductRepository.js';
import GetProductsUseCase from '../GetProductsUseCase.js';

describe('GetProductsUseCase', () => {
  it('should orchestrate the get products use case correctly', async () => {
    // Arrange
    const mockProducts = [
      { id: 'product-1', name: 'Product 1' },
      { id: 'product-2', name: 'Product 2' },
    ];

    const mockProductRepository = new ProductRepository();
    mockProductRepository.getProducts = jest.fn().mockResolvedValue(mockProducts);

    const getProductsUseCase = new GetProductsUseCase({
      productRepository: mockProductRepository,
    });

    // Act
    const products = await getProductsUseCase.execute();

    // Assert
    expect(products).toEqual(mockProducts);
    expect(mockProductRepository.getProducts).toHaveBeenCalled();
  });
});
