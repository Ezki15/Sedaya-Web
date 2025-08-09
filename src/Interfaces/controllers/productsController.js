import AddProductUseCase from '../../Applications/use_cases/AddProductUseCase.js';
import GetProductsUseCase from '../../Applications/use_cases/GetProductsUseCase.js';
import GetSingleProductUseCase from '../../Applications/use_cases/GetSingleProductUseCase.js';
import UpdateProductUseCase from '../../Applications/use_cases/UpdateProductUseCase.js';

class ProductsController {
  constructor(container) {
    this._container = container;

    this.postAddProduct = this.postAddProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.putUpdateProduct = this.putUpdateProduct.bind(this);
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

  async getProductById(req, res) {
    const productId = req.params.id;
    const getSingleProductsUseCase = this._container.getInstance(GetSingleProductUseCase.name);
    const product = await getSingleProductsUseCase.execute(productId);

    return res.status(200).json({ status: 'success', data: { product } });
  }

  async putUpdateProduct(req, res) {
    const updateProductUseCase = this._container.getInstance(UpdateProductUseCase.name);
    const updatedProduct = await updateProductUseCase.execute(req.params.id, req.body);
    return res.status(200).json({ status: 'success', data: updatedProduct });
  }
}

export default ProductsController;
