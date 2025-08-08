import AddProductUseCase from '../../Applications/use_cases/AddProductUseCase.js';

class ProductsController {
  constructor(container) {
    this._container = container;

    this.postAddProduct = this.postAddProduct.bind(this);
  }

  async postAddProduct(req, res) {
    const addProductUseCase = this._container.getInstance(AddProductUseCase.name);
    const addedProduct = await addProductUseCase.execute(req.body);
    return res.status(201).json({ status: 'success', data: addedProduct });
  }
}

export default ProductsController;
