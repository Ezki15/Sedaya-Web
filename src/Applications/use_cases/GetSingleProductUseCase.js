class GetSingleProductUseCase {
  constructor({ productRepository }) {
    this._productRepository = productRepository;
  }

  async execute(productId) {
    this._validatePayload(productId);
    await this._productRepository.validateAvailableProduct(productId);
    return this._productRepository.getProductById(productId);
  }

  _validatePayload(productId) {
    if (!productId) {
      throw new Error('GET_SINGLE_PRODUCT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof productId !== 'string') {
      throw new Error('GET_SINGLE_PRODUCT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default GetSingleProductUseCase;
