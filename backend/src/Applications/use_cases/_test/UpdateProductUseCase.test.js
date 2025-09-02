/* eslint-disable max-len */
import UpdateProductUseCase from '../UpdateProductUseCase.js';
import UpdatedProduct from '../../../Domains/products/entities/UpdatedProduct.js';
import ProductRepository from '../../../Domains/products/ProductRepository.js';

describe('UpdateProductUseCase', () => {
  it('should orchestrating the update product action correcly', async () => {
    // Arrange
    const oldPayload = {
      name: 'Product A',
      description: 'Description of Product A',
      price: 100000,
      stock: 50,
    };
    const productId = 'product-123';

    const updatePayload = {
      name: 'Product B',
      description: 'Description of Product B',
      price: 100000,
      stock: 50,
    };

    const expectedUpdatedProduct = {
      ...updatePayload,
    };

    const mockProductRepository = new ProductRepository();
    mockProductRepository.validateAvailableProduct = jest.fn().mockImplementation(() => Promise.resolve());
    mockProductRepository.getProductById = jest.fn().mockImplementation(() => Promise.resolve(oldPayload));
    mockProductRepository.updateProduct = jest.fn().mockImplementation(() => Promise.resolve(expectedUpdatedProduct));

    const updateProductUseCase = new UpdateProductUseCase({
      productRepository: mockProductRepository,
    });

    // Action
    const updatedProduct = await updateProductUseCase.execute(productId, updatePayload);

    // Assert
    expect(updatedProduct).toStrictEqual(expectedUpdatedProduct);
    expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(productId, new UpdatedProduct(updatePayload));
    expect(mockProductRepository.updateProduct).toHaveBeenCalledTimes(1);
  });
});
