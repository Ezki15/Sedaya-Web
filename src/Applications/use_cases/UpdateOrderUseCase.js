/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
class UpdateOrderUseCase {
  constructor({ orderRepository, productRepository }) {
    this._orderRepository = orderRepository;
    this._productRepository = productRepository;
  }

  async execute(useCasePayload) {
    const updatedOrders = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const updateStatusPayload of useCasePayload) {
      this._validatePayload(updateStatusPayload);
      const { userId, orderId, status } = updateStatusPayload;

      await this._orderRepository.validateAvailableOrder(orderId);

      // if the status is cancelled then the product's stock is returned like before make an order
      if (status === 'cancelled') {
        // get the list of orders with userId as the parameter
        const { itemsOrder } = await this._orderRepository.getOrderById(userId);

        // then loop the orders and do some update stock to products table
        // with stock after order and amount of quantity

        // eslint-disable-next-line no-restricted-syntax
        for (const item of itemsOrder) {
          const { product_id, quantity } = item;
          const product = await this._productRepository.getProductById(product_id);
          product.stock += quantity;
          await this._productRepository.updateProduct(product_id, product);
        }
      }
      const updateOrder = this._orderRepository.updateOrder({ status, orderId });
      updatedOrders.push(updateOrder);
    }

    const result = await Promise.all(updatedOrders);

    return {
      updatedOrders: result,
    };
  }

  _validatePayload({ orderId, status }) {
    if (!status || !orderId) {
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
