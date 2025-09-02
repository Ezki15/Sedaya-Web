import OrderRepository from '../OrderRepository.js';

describe('OrderRepository interface', () => {
  it('should throw error when methods are not implemented', async () => {
    // Arrange
    const orderRepository = new OrderRepository();

    // Action & Assert
    await expect(orderRepository.addOrder({})).rejects.toThrow('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(orderRepository.validateAvailableOrder('')).rejects.toThrow('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(orderRepository.updateOrder({})).rejects.toThrow('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(orderRepository.getOrderById('')).rejects.toThrow('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(orderRepository.getAllOrders('')).rejects.toThrow('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(orderRepository.deleteOrderById('')).rejects.toThrow('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
