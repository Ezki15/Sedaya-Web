import GetAllOrdersUseCase from '../GetAllOrdersUseCase';
import OrderRepository from '../../../Domains/orders/OrderRepository.js';

describe('GetAllOrdersUseCase', () => {
  it('should orchestrate the get all orders action correctly', async () => {
    // Arrange
    const mockOrders = [
      {
        owner: 'user-123',
        orders: [{
          id: 'order-1',
          status: 'pending',
          totalPrice: 300000,
          items: [
            {
              name: 'Product 1', quantity: 2, price: 50000, subtotal: 100000,
            },
            {
              name: 'Product 2', quantity: 2, price: 100000, subtotal: 200000,
            },
          ],
        }],
      },
    ];

    const mockOrderRepository = new OrderRepository();
    mockOrderRepository.getAllOrders = jest.fn().mockResolvedValue(mockOrders);
    const getAllOrdersUseCase = new GetAllOrdersUseCase({
      orderRepository: mockOrderRepository,
    });

    // Action
    const orders = await getAllOrdersUseCase.execute();

    // Assert
    expect(orders).toEqual(mockOrders);
    expect(mockOrderRepository.getAllOrders).toHaveBeenCalled();
  });
});
