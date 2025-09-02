class GetProductsUseCase {
  constructor({ productRepository }) {
    this._productRepository = productRepository;
  }

  async execute() {
    return this._productRepository.getProducts();
  }
}

export default GetProductsUseCase;
