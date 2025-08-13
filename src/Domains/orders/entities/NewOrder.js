class NewOrder {
  constructor(payload) {
    this._verifyPayload(payload);
    this.products = payload.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    }));
  }

  _verifyPayload(payload) {
    if (!payload.length) {
      throw new Error('NEW_ORDER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    payload.forEach((product) => {
      if (typeof product.productId !== 'string' || typeof product.quantity !== 'number') {
        throw new Error('NEW_ORDER.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
      if (product.quantity < 0) {
        throw new Error('NEW_ORDER.QUANTITY_SHOULD_NOT_BE_NEGATIVE');
      }
    });
  }
}

export default NewOrder;
