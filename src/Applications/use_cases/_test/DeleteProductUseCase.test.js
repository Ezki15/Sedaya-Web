/* eslint-disable max-len */
import ProductRepository from '../../../Domains/products/ProductRepository.js';
import DeleteProductUseCase from '../DeleteProductUseCase.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('DeleteProductUseCase', () => {
  it('should throw NotFoundError when product is not found', async () => {
    // Arrange
    const productId = 'product-123';

    const mockProductRepository = new ProductRepository();
    mockProductRepository.getProductById = jest.fn().mockImplementation(() => {
      throw new NotFoundError('Product tidak ditemukan');
    });

    const deleteProductUseCase = new DeleteProductUseCase({
      productRepository: mockProductRepository,
    });

    // Act & Assert
    await expect(deleteProductUseCase.execute(productId)).rejects.toThrow(NotFoundError);
  });

  it('should orchestrating the delete product successfully', async () => {
    // Arrange
    const productId = 'product-123';

    const mockProductRepository = new ProductRepository();
    mockProductRepository.getProductById = jest.fn().mockImplementation(() => Promise.resolve({ id: 'product-123' }));
    mockProductRepository.deleteProductById = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteProductUseCase = new DeleteProductUseCase({
      productRepository: mockProductRepository,
    });

    // Act
    await deleteProductUseCase.execute(productId);

    // Assert
    expect(mockProductRepository.getProductById).toHaveBeenCalledWith(productId);
    expect(mockProductRepository.deleteProductById).toHaveBeenCalledWith(productId);
  });
});
