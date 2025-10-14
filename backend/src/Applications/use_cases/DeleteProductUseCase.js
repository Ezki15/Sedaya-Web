class DeleteProductUseCase {
  constructor({ productRepository }) {
    this._productRepository = productRepository;
  }

  async execute(productId) {
    console.log(productId);
    await this._productRepository.validateAvailableProduct(productId);
    console.log('validated');
    await this._productRepository.deleteProductById(productId);
    console.log('deleted');
  }
}

export default DeleteProductUseCase;
