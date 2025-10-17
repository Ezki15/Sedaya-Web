class NewProduct {
  constructor(payload, imagePath) {
    this._verifyPayload(payload);

    const {
      name, description, price, stock,
    } = payload;

    this.name = name;
    this.description = description;
    this.price = Number(price);
    this.stock = Number(stock);
    this.imagePath = imagePath;
  }

  _verifyPayload({
    name, description, price, stock,
  }) {
    if (!name || !description || !price || !stock) {
      throw new Error('NEW_PRODUCT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof name !== 'string' || typeof description !== 'string' || typeof price !== 'number' || typeof stock !== 'number') {
      throw new Error('NEW_PRODUCT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (stock < 0 || price < 0) {
      throw new Error('NEW_PRODUCT.STOCK_AND_PRICE_VALUE_SHOULD_NOT_BE_NEGATIVE');
    }
  }
}

export default NewProduct;
