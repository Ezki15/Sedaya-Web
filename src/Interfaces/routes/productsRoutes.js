/* eslint-disable max-len */
import { Router } from 'express';
import ProductsController from '../controllers/productsController.js';
import AuthenticationMiddleware from '../middlewares/authMiddleware.js';
import AdminVerifier from '../middlewares/adminVerifier.js';

// injecting dependencies
const productsRoutes = (container) => {
  const router = Router();
  const productsController = new ProductsController(container);
  const authenticationMiddleware = AuthenticationMiddleware(container.getInstance('AuthenticationTokenManager'));
  const adminVerifier = AdminVerifier(container.getInstance('UserRepository'));

  router.post('/products', authenticationMiddleware, adminVerifier, productsController.postAddProduct);
  router.get('/products', authenticationMiddleware, productsController.getProducts); // able to access from anyone who login

  return router;
};

export default productsRoutes;
