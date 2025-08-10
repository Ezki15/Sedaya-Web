/* eslint-disable max-len */
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import ProductRepository from '../../Domains/products/ProductRepository.js';

class ProductRepositoryPostgres extends ProductRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addProduct(newProduct) {
    const id = `product-${this._idGenerator()}`;
    const isDeleted = false; // Default value for is_deleted
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO products VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name',
      values: [
        id,
        newProduct.name,
        newProduct.description,
        newProduct.price,
        newProduct.stock,
        isDeleted,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);
    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
    };
  }

  async getProducts() {
    const query = {
      text: 'SELECT id, name, description, price, stock FROM products',
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      stock: Number(row.stock),
    }));
  }

  async validateAvailableProduct(productId) {
    const query = {
      text: 'SELECT id FROM products WHERE id = $1',
      values: [productId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Product tidak ada');
    }
  }

  async getProductById(productId) {
    const query = {
      text: 'SELECT id, name, description, price, stock FROM products WHERE id = $1',
      values: [productId],
    };

    const result = await this._pool.query(query);

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      stock: Number(row.stock),
    };
  }

  async updateProduct(productId, updatedProduct) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, updated_at = $5 WHERE id = $6 RETURNING id, name, description, price, stock',
      values: [
        updatedProduct.name,
        updatedProduct.description,
        updatedProduct.price,
        updatedProduct.stock,
        updatedAt,
        productId,
      ],
    };

    const result = await this._pool.query(query);
    return {
      name: result.rows[0].name,
      description: result.rows[0].description,
      price: Number(result.rows[0].price),
      stock: Number(result.rows[0].stock),
    };
  }
}

export default ProductRepositoryPostgres;
