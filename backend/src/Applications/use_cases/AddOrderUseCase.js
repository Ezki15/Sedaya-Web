/* eslint-disable no-await-in-loop */
import NewOrder from '../../Domains/orders/entities/NewOrder.js';

class AddOrderUseCase {
  constructor({ orderRepository, productRepository }) {
    this._orderRepository = orderRepository;
    this._productRepository = productRepository;
  }

  async execute(useCasePayload, owner) {
    // Validate each product's availability
    // eslint-disable-next-line no-restricted-syntax
    for (const payload of useCasePayload) {
      this._validatePayload(payload);
      const { productId } = payload;
      await this._productRepository.validateAvailableProduct(productId);
    }

    let totalPrice = 0;

    // Calculate total price and check stock for each product
    // eslint-disable-next-line no-restricted-syntax
    for (const payload of useCasePayload) {
      const { productId } = payload;
      const product = await this._productRepository.getProductById(productId);
      if (product.stock - payload.quantity < 0) {
        throw new Error('ADD_ORDER_USE_CASE.STOCK_PRODUCT_LESS_THAN_QUANTITY_ORDER');
      }
      product.stock -= payload.quantity;
      await this._productRepository.updateProduct(productId, product);
      totalPrice += product.price * payload.quantity;
    }

    // Create a new order
    const newOrder = new NewOrder(useCasePayload, totalPrice, owner);

    return this._orderRepository.addOrder(newOrder);
  }

  _validatePayload({ productId, quantity }) {
    if (!productId || !quantity) {
      throw new Error('NEW_ORDER.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof productId !== 'string' || typeof quantity !== 'number') {
      throw new Error('NEW_ORDER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddOrderUseCase;
