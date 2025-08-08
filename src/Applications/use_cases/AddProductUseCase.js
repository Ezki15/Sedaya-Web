import NewProduct from '../../Domains/products/entities/NewProduct.js';

class AddProductUseCase {
  constructor({ productRepository }) {
    this._productRepository = productRepository;
  }

  async execute(useCasePayload) {
    const newProduct = new NewProduct(useCasePayload);
    return this._productRepository.addProduct(newProduct);
  }
}

export default AddProductUseCase;
