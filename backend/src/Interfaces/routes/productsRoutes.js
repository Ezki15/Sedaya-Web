/* eslint-disable max-len */
import { Router } from 'express';
import ProductsController from '../controllers/productsController.js';
import AuthenticationMiddleware from '../middlewares/authMiddleware.js';
import AdminVerifier from '../middlewares/adminVerifier.js';
import upload from '../../../config/file/multer.js';

// injecting dependencies
const productsRoutes = (container) => {
  const router = Router();
  const productsController = new ProductsController(container);
  const authenticationMiddleware = AuthenticationMiddleware(container.getInstance('AuthenticationTokenManager'));
  const adminVerifier = AdminVerifier(container.getInstance('UserRepository'));

  router.post('/products', authenticationMiddleware, adminVerifier, upload.single('image'), productsController.postAddProduct);
  router.get('/products', authenticationMiddleware, productsController.getProducts); // able to access from anyone who login
  router.get('/products/:id', authenticationMiddleware, productsController.getProductById); // able to access from anyone who login
  router.put('/products/:id', authenticationMiddleware, adminVerifier, productsController.putUpdateProduct); // only admin can access
  router.delete('/products/:id', authenticationMiddleware, adminVerifier, productsController.deleteProduct); // only admin can access

  return router;
};

export default productsRoutes;
