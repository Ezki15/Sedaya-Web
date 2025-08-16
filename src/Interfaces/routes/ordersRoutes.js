import { Router } from 'express';
import OrdersController from '../controllers/ordersController.js';
import AuthenticationMiddleware from '../middlewares/authMiddleware.js';
// import AdminVerifier from '../middlewares/adminVerifier.js';

// injecting dependencies
const ordersRoutes = (container) => {
  const router = Router();
  const ordersController = new OrdersController(container);
  const authenticationMiddleware = AuthenticationMiddleware(container.getInstance('AuthenticationTokenManager'));
  // const adminVerifier = AdminVerifier(container.getInstance('UserRepository'));

  router.post('/orders', authenticationMiddleware, ordersController.postAddOrder);

  return router;
};

export default ordersRoutes;
