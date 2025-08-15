/* eslint-disable max-len */
import AddOrderUseCase from '../AddOrderUseCase';
import OrderRepository from '../../../Domains/orders/OrderRepository.js';
import ProductRepository from '../../../Domains/products/ProductRepository.js';
import NewOrder from '../../../Domains/orders/entities/NewOrder.js';

describe('AddOrderUseCase', () => {
  it('should orchestrating the add order action correctly', async () => {
    // Arrange
    const useCasePayload = [
      { productId: 'product-123', quantity: 2 },
      { productId: 'product-456', quantity: 1 },
    ];

    const expectedAddedOrder = {
      id: 'order-123',
      products: useCasePayload.products,
      status: 'pending',
    };
    const mockOrderRepository = new OrderRepository();
    const mockProductRepository = new ProductRepository();
    mockProductRepository.validateAvailableProduct = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockProductRepository.getProductById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        name: 'Product A',
        description: 'Description of Product A',
        price: 100000,
        stock: 50,
      }));
    mockOrderRepository.addOrder = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedOrder));

    const addOrderUseCase = new AddOrderUseCase({
      orderRepository: mockOrderRepository,
      productRepository: mockProductRepository,
    });

    // Action
    const addedOrder = await addOrderUseCase.execute(useCasePayload);

    // Assert
    expect(addedOrder).toStrictEqual(expectedAddedOrder);
    expect(mockOrderRepository.addOrder).toHaveBeenCalledWith(new NewOrder(useCasePayload));
    expect(mockProductRepository.validateAvailableProduct).toHaveBeenCalledTimes(useCasePayload.length);
    expect(mockProductRepository.getProductById).toHaveBeenCalledTimes(useCasePayload.length);
    expect(mockOrderRepository.addOrder).toHaveBeenCalledTimes(1);
  });

  it('should throw error when quantity higher than product stock', async () => {
    // Arrange
    const useCasePayload = [
      { productId: 'product-123', quantity: 5 },
    ];

    const mockOrderRepository = new OrderRepository();
    const mockProductRepository = new ProductRepository();
    mockProductRepository.validateAvailableProduct = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockProductRepository.getProductById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        name: 'Product A',
        description: 'Description of Product A',
        price: 100000,
        stock: 4,
      }));

    const addOrderUseCase = new AddOrderUseCase({
      orderRepository: mockOrderRepository,
      productRepository: mockProductRepository,
    });

    // Action & assert
    await expect(addOrderUseCase.execute(useCasePayload)).rejects.toThrow('ADD_ORDER_USE_CASE.STOCK_PRODUCT_LESS_THAN_QUANTITY_ORDER');
  });

  it('should throw error when product is not available', async () => {
    // Arrange
    const useCasePayload = [
      { productId: 'product-123', quantity: 5 },
    ];

    const mockOrderRepository = new OrderRepository();
    const mockProductRepository = new ProductRepository();
    mockProductRepository.validateAvailableProduct = jest.fn()
      .mockImplementation(() => { throw new Error('Product tidak ada'); });

    const addOrderUseCase = new AddOrderUseCase({
      orderRepository: mockOrderRepository,
      productRepository: mockProductRepository,
    });

    // Action & assert
    await expect(addOrderUseCase.execute(useCasePayload)).rejects.toThrow('Product tidak ada');
  });
});
