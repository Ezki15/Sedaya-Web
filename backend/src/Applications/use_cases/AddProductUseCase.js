import NewProduct from '../../Domains/products/entities/NewProduct.js';

class AddProductUseCase {
  constructor({ productRepository }) {
    this._productRepository = productRepository;
  }

  async execute(useCasePayload) {
    const price = Number(useCasePayload.price);
    const stock = Number(useCasePayload.stock);
    const payload = { ...useCasePayload, price, stock };
    const newProduct = new NewProduct(payload);
    return this._productRepository.addProduct(newProduct);
  }
}

export default AddProductUseCase;
