class UpdateOrderUseCase {
  constructor({ orderRepository }) {
    this._orderRepository = orderRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    // eslint-disable-next-line no-restricted-syntax
    for (const orderId of useCasePayload.orderIds) {
      // eslint-disable-next-line no-await-in-loop
      await this._orderRepository.validateAvailableOrder(orderId);
    }

    const updatedOrders = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const orderId of useCasePayload.orderIds) {
      const { status } = useCasePayload;
      // eslint-disable-next-line no-await-in-loop
      const updateOrder = await this._orderRepository.updateOrder({ status, orderId });
      updatedOrders.push(updateOrder);
    }

    return {
      updatedOrders,
    };
  }

  _validatePayload({ orderIds, status }) {
    if (!status || !orderIds) {
      throw new Error('UPDATED_ORDER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof status !== 'string') {
      throw new Error('UPDATED_ORDER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!['completed', 'cancelled'].includes(status)) {
      throw new Error('UPDATED_ORDER.INVALID_STATUS_DATA');
    }
  }
}

export default UpdateOrderUseCase;
