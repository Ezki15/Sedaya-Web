/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import path from 'path';
import fs from 'fs';
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
      text: 'INSERT INTO products VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, name, description, price, stock',
      values: [
        id,
        newProduct.name,
        newProduct.description,
        newProduct.price,
        newProduct.stock,
        isDeleted,
        createdAt,
        updatedAt,
        newProduct.imagePath,
      ],
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

  async getProducts() {
    const isDeleted = false; // Only fetch products that are not deleted
    const query = {
      text: 'SELECT id, name, description, price, stock, created_at, image_path FROM products WHERE is_deleted = $1',
      values: [isDeleted],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      stock: Number(row.stock),
      createdAt: row.created_at,
      imagePath: row.image_path,
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
    const isDeleted = false; // Only fetch products that are not deleted
    const query = {
      text: 'SELECT id, name, description, price, stock, image_path FROM products WHERE id = $1 AND is_deleted = $2',
      values: [productId, isDeleted],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Product tidak ditemukan');
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      stock: Number(row.stock),
      imagePath: row.image_path,
    };
  }

  async updateProduct(productId, updatedProduct, oldImagePath) {
    // Delete the old image file from the filesystem if the image has been updated
    if (oldImagePath && updatedProduct.imagePath && oldImagePath !== updatedProduct.imagePath) {
      const imagePath = path.join('./uploads/products/', oldImagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting image file:', err);
        });
      }
    }

    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, updated_at = $5, image_path = $6 WHERE id = $7 RETURNING id, name, description, price, stock',
      values: [
        updatedProduct.name,
        updatedProduct.description,
        updatedProduct.price,
        updatedProduct.stock,
        updatedAt,
        updatedProduct.imagePath,
        productId,
      ],
    };

    const result = await this._pool.query(query);
    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      description: result.rows[0].description,
      price: Number(result.rows[0].price),
      stock: Number(result.rows[0].stock),
    };
  }

  async deleteProductById(productId, image) {
    const isDeleted = true;
    const query = {
      text: 'UPDATE products SET is_deleted = $1 WHERE id = $2',
      values: [isDeleted, productId],
    };
    await this._pool.query(query);
    // Delete the image file from the filesystem
    const imagePath = path.join('./uploads/products/', image);
    // console.log('Ini adalah image yang akan dihapus:', imagePath);
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    }
  }
}

export default ProductRepositoryPostgres;
