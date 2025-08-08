import { Router } from 'express';
import ProductsController from '../controllers/productsController.js';
import AuthenticationMiddleware from '../middlewares/authMiddleware.js';
import AdminVerifier from '../middlewares/adminVerifier.js';

// injecting dependencies
const productsRoutes = (container) => {
  const router = Router();
  const productsController = new ProductsController(container);
  const authenticationMiddleware = new AuthenticationMiddleware(container.getInstance('AuthenticationTokenManager'));
  const adminVerifier = new AdminVerifier(container.getInstance('UserRepository'));

  router.post('/products', authenticationMiddleware, adminVerifier, productsController.postAddProduct);

  return router;
};

export default productsRoutes;
