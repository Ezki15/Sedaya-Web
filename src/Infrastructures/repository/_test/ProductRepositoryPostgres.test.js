import crypto from 'crypto';
import ProductsTableTestHelper from '../../../../test/ProductsTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import NewProduct from '../../../Domains/products/entities/NewProduct.js';
import ProductRepositoryPostgres from '../ProductRepositoryPostgres.js';
// import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('ProductRepositoryPostgres', () => {
  afterEach(async () => {
    await ProductsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addProduct function', () => {
    it('should persist new product', async () => {
      const newProduct = new NewProduct({
        name: 'Test Product',
        description: 'Test Description',
        price: 100000,
        stock: 50,
      });
      const fakeIdGenerator = () => '123';
      const productRepository = new ProductRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await productRepository.addProduct(newProduct);

      // Assert
      const product = await ProductsTableTestHelper.findProductById('product-123');
      expect(product).toHaveLength(1);
    });

    it('should return the added product correctly', async () => {
      // Arrange
      const newProduct = new NewProduct({
        name: 'Test Product',
        description: 'Test Description',
        price: 100000,
        stock: 50,
      });
      const fakeIdGenerator = () => '123';
      const productRepository = new ProductRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedProduct = await productRepository.addProduct(newProduct);

      // Assert
      expect(addedProduct).toStrictEqual({
        id: 'product-123',
        name: newProduct.name,
      });
    });
  });

  describe('getProducts function', () => {
    it('should return all products', async () => {
      // Arrange
      const newProduct1 = new NewProduct({
        name: 'Test Product 1',
        description: 'Test Description 1',
        price: 100000,
        stock: 50,
      });
      const newProduct2 = new NewProduct({
        name: 'Test Product 2',
        description: 'Test Description 2',
        price: 200000,
        stock: 30,
      });
      const fakeIdGenerator = () => crypto.randomBytes(10).toString('hex');
      const productRepository = new ProductRepositoryPostgres(pool, fakeIdGenerator);

      await productRepository.addProduct(newProduct1);
      await productRepository.addProduct(newProduct2);

      // Action
      const products = await productRepository.getProducts();

      // Assert
      expect(products).toHaveLength(2);
      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('name', newProduct1.name);
      expect(products[1]).toHaveProperty('id');
      expect(products[1]).toHaveProperty('name', newProduct2.name);
    });
  });
});
