/* eslint-disable max-len */
import UpdatedProduct from '../../Domains/products/entities/UpdatedProduct.js';

class UpdateProductUseCase {
  constructor({ productRepository }) {
    this._productRepository = productRepository;
  }

  async execute(productId, useCasePayload, imagePath) {
    const price = Number(useCasePayload.price);
    const stock = Number(useCasePayload.stock);
    const payload = { ...useCasePayload, price, stock };

    await this._productRepository.validateAvailableProduct(productId);
    const oldData = await this._productRepository.getProductById(productId);

    let newImagePath;

    if (imagePath === null) {
      newImagePath = oldData.imagePath;
    } else {
      // Jika upload file baru → pakai file baru
      newImagePath = imagePath;
    }

    // console.log({ oldImage: oldData.imagePath, newImage: imagePath, usedImage: newImagePath });

    const updatedProdcut = new UpdatedProduct(payload, newImagePath);

    const updateData = await this._productRepository.updateProduct(productId, updatedProdcut, oldData.imagePath);

    return {
      ...oldData,
      ...updateData,
    };
  }
}

export default UpdateProductUseCase;
