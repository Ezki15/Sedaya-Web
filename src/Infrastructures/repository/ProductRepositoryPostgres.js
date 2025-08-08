import ProductRepository from '../../Domains/products/ProductRepository.js';

class ProductRepositoryPostgres extends ProductRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addProduct(newProduct) {
    const id = `product-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO products VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, name',
      values: [
        id,
        newProduct.name,
        newProduct.description,
        newProduct.price,
        newProduct.stock,
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
      price: row.price,
      stock: row.stock,
    }));
  }
}

export default ProductRepositoryPostgres;
