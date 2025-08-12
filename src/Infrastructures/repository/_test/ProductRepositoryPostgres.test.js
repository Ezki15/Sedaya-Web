import crypto from 'crypto';
import ProductsTableTestHelper from '../../../../test/ProductsTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import NewProduct from '../../../Domains/products/entities/NewProduct.js';
import UpdatedProduct from '../../../Domains/products/entities/UpdatedProduct.js';
import ProductRepositoryPostgres from '../ProductRepositoryPostgres.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

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

  describe('validateAvailableProduct function', () => {
    it('should not throw error if product is available', async () => {
      // Arrange
      const newProduct = new NewProduct({
        name: 'Test Product',
        description: 'Test Description',
        price: 100000,
        stock: 50,
      });
      const fakeIdGenerator = () => '123';
      const productRepository = new ProductRepositoryPostgres(pool, fakeIdGenerator);

      await productRepository.addProduct(newProduct);

      // Action & Assert
      await expect(productRepository.validateAvailableProduct('product-123')).resolves.not.toThrow();
    });

    it('should throw NotFoundError if product is not available', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const productRepository = new ProductRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(productRepository.validateAvailableProduct('product-999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getProductById function', () => {
    it('should return product by id', async () => {
      // Arrange
      await ProductsTableTestHelper.addProduct({
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100000,
        stock: 50,
      });
      const productId = 'product-123';
      const fakeIdGenerator = () => '123';
      const productRepository = new ProductRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const product = await productRepository.getProductById(productId);

      // Assert
      expect(product).toEqual({
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100000,
        stock: 50,
      });
    });

    it('should throw NotFoundError if product does not exist with is_deleted is true', async () => {
      // Arrange
      await ProductsTableTestHelper.addProduct({
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100000,
        stock: 50,
        is_deleted: true,
      });
      const fakeIdGenerator = () => '123';
      const productRepository = new ProductRepositoryPostgres(pool, fakeIdGenerator);
      const productId = 'product-123';

      // Action & Assert
      await expect(productRepository.getProductById(productId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProduct function', () => {
    it('should update product details', async () => {
      // Arrange
      const newProduct = new NewProduct({
        name: 'Old Product',
        description: 'Old Description',
        price: 100000,
        stock: 50,
      });
      const fakeIdGenerator = () => '123';
      const productId = 'product-123';
      const productRepository = new ProductRepositoryPostgres(pool, fakeIdGenerator);

      await productRepository.addProduct(newProduct);

      const updatedProduct = new UpdatedProduct({
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150000,
        stock: 20,
      });

      // Action
      await productRepository.updateProduct(productId, updatedProduct);

      // Assert
      const product = await ProductsTableTestHelper.findProductById('product-123');
      expect(product).toHaveLength(1);
      expect(product[0].name).toBe(updatedProduct.name);
      expect(product[0].description).toBe(updatedProduct.description);
      expect(Number(product[0].price)).toBe(updatedProduct.price);
      expect(Number(product[0].stock)).toBe(updatedProduct.stock);
    });
  });

  describe('deleteProduct function', () => {
    it('should delete product by id', async () => {
      // Arrange
      await ProductsTableTestHelper.addProduct({});
      const fakeIdGenerator = () => '123';
      const productRepository = new ProductRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await productRepository.deleteProductById('product-123');

      // Assert
      const product = await ProductsTableTestHelper.findProductById('product-123');
      expect(product).toHaveLength(0);
    });
  });
});
