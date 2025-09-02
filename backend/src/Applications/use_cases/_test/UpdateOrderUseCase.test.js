/* eslint-disable max-len */
import UpdateOrderUseCase from '../UpdateOrderUseCase.js';
import OrderRepository from '../../../Domains/orders/OrderRepository.js';
import ProductRepository from '../../../Domains/products/ProductRepository.js';

describe('UpdateOrderUseCase', () => {
  it('should should orchestrating the update order action correcly', async () => {
    // Arrange
    // const payload = {
    //   orderIds: ['order-123'],
    //   status: 'completed',
    // };

    const mockPayload = [
      { userId: 'user-123', orderId: 'order-123', status: 'completed' },
      // { userId: 'user-234', orderId: 'order-123', status: 'cancelled' },
    ];

    const status = 'completed';
    const orderId = 'order-123';

    const expectedUpdatedOrder = {
      updatedOrders: [
        { orderId: 'order-123', status: 'completed' },
      ],
    };

    const mockOrderRepository = new OrderRepository();
    const mockProductRepository = new ProductRepository();
    mockOrderRepository.validateAvailableOrder = jest.fn().mockImplementation(() => Promise.resolve());
    mockOrderRepository.getOrderById = jest.fn().mockImplementation(() => Promise.resolve({
      orders: [{
        orderid: 'order-123', user_id: 'user-123', fullname: 'User App', status: 'pending', totalprice: 40000,
      }],
    }));
    mockOrderRepository.updateOrder = jest.fn().mockImplementation(() => Promise.resolve({ orderId: 'order-123', status: 'completed' }));

    const updateOrderUseCase = new UpdateOrderUseCase({
      orderRepository: mockOrderRepository,
      productRepository: mockProductRepository,
    });

    // Action
    const updatedOrder = await updateOrderUseCase.execute(mockPayload);

    // Assert
    expect(updatedOrder).toStrictEqual(expectedUpdatedOrder);
    expect(mockOrderRepository.updateOrder).toHaveBeenCalledWith({ status, orderId });
    expect(mockOrderRepository.updateOrder).toHaveBeenCalledTimes(1);
  });

  it('should throw Error when payload did not contain needed property', async () => {
    // Arrange
    // const payload = {
    //   orderIds: ['order-123'],
    //   // status is missing
    // };

    const mockPayload = [
      { userId: 'user-123', orderId: 'order-123' }, // status is missing
    ];

    const updateOrderUseCase = new UpdateOrderUseCase({});

    // Action & assert
    await expect(updateOrderUseCase.execute(mockPayload)).rejects.toThrow('UPDATED_ORDER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw Error when payload property did not meet data type specification', async () => {
    // Arrange
    // const payload = {
    //   orderIds: ['order-123'],
    //   status: 1234,
    // };

    const mockPayload = [
      { userId: 'user-123', orderId: 'order-123', status: 1234 },
      // { userId: 'user-234', orderId: 'order-123', status: 'cancelled' },
    ];

    const updateOrderUseCase = new UpdateOrderUseCase({});

    // Action & assert
    await expect(updateOrderUseCase.execute(mockPayload)).rejects.toThrow('UPDATED_ORDER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw Error when payload status is not valid', async () => {
    // Arrange
    // const payload = {
    //   orderIds: ['order-123'],
    //   status: 'selesai',
    // };

    const mockPayload = [
      { userId: 'user-123', orderId: 'order-123', status: 'selesai' },
      // { userId: 'user-234', orderId: 'order-123', status: 'cancelled' },
    ];

    const updateOrderUseCase = new UpdateOrderUseCase({});

    // Action & assert
    await expect(updateOrderUseCase.execute(mockPayload)).rejects.toThrow('UPDATED_ORDER.INVALID_STATUS_DATA');
  });
});
