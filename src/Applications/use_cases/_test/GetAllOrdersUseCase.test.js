/* eslint-disable object-curly-newline */
import GetAllOrdersUseCase from '../GetAllOrdersUseCase';
import OrderRepository from '../../../Domains/orders/OrderRepository.js';

describe('GetAllOrdersUseCase', () => {
  it('should orchestrate the get all orders action correctly', async () => {
    // Arrange
    const mockOrders = [
      {
        orderId: 'order-1',
        owner: 'user-123',
        status: 'pending',
        totalPrice: 300000,
      },
    ];

    const mockItems = {
      items: [
        { name: 'Product 1', quantity: 2, price: 50000, subtotal: 100000 },
        { name: 'Product 2', quantity: 2, price: 100000, subtotal: 200000 },
      ],
    };

    const mockOrderRepository = new OrderRepository();
    mockOrderRepository.getAllOrders = jest.fn().mockResolvedValue({
      orders: mockOrders,
      itemsOrder: mockItems.items });
    const getAllOrdersUseCase = new GetAllOrdersUseCase({
      orderRepository: mockOrderRepository,
    });

    // Action
    const orders = await getAllOrdersUseCase.execute();

    // Assert
    expect(orders).toBeDefined();
    expect(mockOrderRepository.getAllOrders).toHaveBeenCalled();
  });
});
