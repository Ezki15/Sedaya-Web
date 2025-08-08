import ProductRepository from '../ProductRepository.js';

describe('ProductRepository interface', () => {
  it('should throw error when methods are not implemented', async () => {
    // Arrange
    const productRepository = new ProductRepository();

    // Action & Assert
    await expect(productRepository.addProduct({})).rejects.toThrow('PRODUCT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(productRepository.validateAvailableProduct('')).rejects.toThrow('PRODUCT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(productRepository.updateProduct({})).rejects.toThrow('PRODUCT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(productRepository.getProductById('')).rejects.toThrow('PRODUCT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(productRepository.deleteProduct('')).rejects.toThrow('PRODUCT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
