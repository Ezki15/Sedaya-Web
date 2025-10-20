class DeleteProductUseCase {
  constructor({ productRepository }) {
    this._productRepository = productRepository;
  }

  async execute(productId) {
    await this._productRepository.validateAvailableProduct(productId);
    const { imagePath } = await this._productRepository.getProductById(productId);
    await this._productRepository.deleteProductById(productId, imagePath);
  }
}

export default DeleteProductUseCase;
