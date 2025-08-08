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
});
