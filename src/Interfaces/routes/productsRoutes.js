import { Router } from 'express';
import ProductsController from '../controllers/productsController.js';
import authenticationMiddleware from '../middlewares/authMiddleware.js';

// injecting dependencies
const productsRoutes = (container) => {
  const router = Router();
  const productsController = new ProductsController(container);

  router.post('/products', authenticationMiddleware, productsController.postAddProduct);

  return router;
};

export default productsRoutes;
