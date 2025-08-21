/* eslint-disable max-len */
import UpdateOrderUseCase from '../UpdateOrderUseCase.js';
import OrderRepository from '../../../Domains/orders/OrderRepository.js';

describe('UpdateOrderUseCase', () => {
  it('should should orchestrating the update order action correcly', async () => {
    // Arrange
    const payload = {
      orderIds: ['order-123'],
      status: 'completed',
    };

    const status = 'completed';
    const orderId = 'order-123';

    const expectedUpdatedOrder = {
      updatedOrders: [
        { orderId: 'order-123', status: 'completed' },
      ],
    };

    const mockOrderRepository = new OrderRepository();
    mockOrderRepository.validateAvailableOrder = jest.fn().mockImplementation(() => Promise.resolve());
    mockOrderRepository.updateOrder = jest.fn().mockImplementation(() => Promise.resolve({ orderId: 'order-123', status: 'completed' }));

    const updateOrderUseCase = new UpdateOrderUseCase({
      orderRepository: mockOrderRepository,
    });

    // Action
    const updatedOrder = await updateOrderUseCase.execute(payload);

    // Assert
    expect(updatedOrder).toStrictEqual(expectedUpdatedOrder);
    expect(mockOrderRepository.updateOrder).toHaveBeenCalledWith({ status, orderId });
    expect(mockOrderRepository.updateOrder).toHaveBeenCalledTimes(1);
  });

  it('should throw Error when payload did not contain needed property', async () => {
    // Arrange
    const payload = {
      orderIds: ['order-123'],
      // status is missing
    };

    const updateOrderUseCase = new UpdateOrderUseCase({});

    // Action & assert
    await expect(updateOrderUseCase.execute(payload)).rejects.toThrow('UPDATED_ORDER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw Error when payload property did not meet data type specification', async () => {
    // Arrange
    const payload = {
      orderIds: ['order-123'],
      status: 1234,
    };

    const updateOrderUseCase = new UpdateOrderUseCase({});

    // Action & assert
    await expect(updateOrderUseCase.execute(payload)).rejects.toThrow('UPDATED_ORDER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw Error when payload status is not valid', async () => {
    // Arrange
    const payload = {
      orderIds: ['order-123'],
      status: 'selesai',
    };

    const updateOrderUseCase = new UpdateOrderUseCase({});

    // Action & assert
    await expect(updateOrderUseCase.execute(payload)).rejects.toThrow('UPDATED_ORDER.INVALID_STATUS_DATA');
  });
});
