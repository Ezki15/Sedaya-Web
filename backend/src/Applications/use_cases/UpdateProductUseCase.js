/* eslint-disable max-len */
import UpdatedProduct from '../../Domains/products/entities/UpdatedProduct.js';

class UpdateProductUseCase {
  constructor({ productRepository }) {
    this._productRepository = productRepository;
  }

  async execute(productId, useCasePayload) {
    const price = Number(useCasePayload.price);
    const stock = Number(useCasePayload.stock);
    const payload = { ...useCasePayload, price, stock };

    await this._productRepository.validateAvailableProduct(productId);
    const oldData = await this._productRepository.getProductById(productId);
    const updateData = await this._productRepository.updateProduct(productId, new UpdatedProduct(payload));

    return {
      ...oldData,
      ...updateData,
    };
  }
}

export default UpdateProductUseCase;
