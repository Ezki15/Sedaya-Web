import AddProductUseCase from '../../Applications/use_cases/AddProductUseCase.js';
import GetProductsUseCase from '../../Applications/use_cases/GetProductsUseCase.js';

class ProductsController {
  constructor(container) {
    this._container = container;

    this.postAddProduct = this.postAddProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
  }

  async postAddProduct(req, res) {
    const addProductUseCase = this._container.getInstance(AddProductUseCase.name);
    const addedProduct = await addProductUseCase.execute(req.body);
    return res.status(201).json({ status: 'success', data: addedProduct });
  }

  async getProducts(req, res) {
    const getProductsUseCase = this._container.getInstance(GetProductsUseCase.name);
    const products = await getProductsUseCase.execute();
    return res.status(200).json({ status: 'success', data: products });
  }
}

export default ProductsController;
