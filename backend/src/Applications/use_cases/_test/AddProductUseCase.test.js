/* eslint-disable max-len */
import AddProductUseCase from '../AddProductUseCase.js';
import NewProduct from '../../../Domains/products/entities/NewProduct.js';
import ProductRepository from '../../../Domains/products/ProductRepository.js';

describe('AddProductUseCase', () => {
  it('should orchestrating the add product action correctly', async () => {
    // Arrange
    const useCasePayload = {
      name: 'Product A',
      description: 'Description of Product A',
      price: 100000,
      stock: 50,
    };
    const expectedAddedProduct = {
      id: 'product-123',
      name: useCasePayload.name,
    };

    const imagePath = 'uploads/images/products/xxxx.jpg';

    const mockProductRepository = new ProductRepository();
    mockProductRepository.addProduct = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedProduct));

    const addProductUseCase = new AddProductUseCase({
      productRepository: mockProductRepository,
    });

    // Action
    const addedProduct = await addProductUseCase.execute(useCasePayload, imagePath);

    // Assert
    expect(addedProduct).toStrictEqual(expectedAddedProduct);
    expect(mockProductRepository.addProduct).toHaveBeenCalledWith(new NewProduct(useCasePayload, imagePath));
    expect(mockProductRepository.addProduct).toHaveBeenCalledTimes(1);
  });
});
