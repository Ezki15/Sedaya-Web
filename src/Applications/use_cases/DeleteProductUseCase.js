class DeleteProductUseCase {
  constructor({ productRepository }) {
    this._productRepository = productRepository;
  }

  async execute(productId) {
    await this._productRepository.validateAvailableProduct(productId);
    await this._productRepository.deleteProductById(productId);
  }
}

export default DeleteProductUseCase;
