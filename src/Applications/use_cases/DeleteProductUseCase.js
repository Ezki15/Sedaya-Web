class DeleteProductUseCase {
  constructor({ productRepository }) {
    this._productRepository = productRepository;
  }

  async execute(productId) {
    await this._productRepository.getProductById(productId);
    await this._productRepository.deleteProductById(productId);
  }
}

export default DeleteProductUseCase;
