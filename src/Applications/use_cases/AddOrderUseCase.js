/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import NewOrder from '../../Domains/orders/entities/NewOrder.js';

class AddOrderUseCase {
  constructor({ orderRepository, productRepository }) {
    this._orderRepository = orderRepository;
    this._productRepository = productRepository;
  }

  async execute(useCasePayload) {
    const newOrder = new NewOrder(useCasePayload);

    for (const payload of useCasePayload) {
      const { productId } = payload;
      await this._productRepository.validateAvailableProduct(productId);
    }

    for (const payload of useCasePayload) {
      const { productId } = payload;
      const product = await this._productRepository.getProductById(productId);
      if (product.stock - payload.quantity < 0) {
        throw new Error('ADD_ORDER_USE_CASE.STOCK_PRODUCT_LESS_THAN_QUANTITY_ORDER');
      }
    }

    return this._orderRepository.addOrder(newOrder);
  }
}

export default AddOrderUseCase;
