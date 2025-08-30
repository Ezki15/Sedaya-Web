/* eslint-disable max-len */
import { Router } from 'express';
import CustomersController from '../controllers/customersController.js';
import AuthenticationMiddleware from '../middlewares/authMiddleware.js';
import AdminVerifier from '../middlewares/adminVerifier.js';

// injecting dependencies
const customersRoutes = (container) => {
  const router = Router();
  const customersController = new CustomersController(container);
  const authenticationMiddleware = AuthenticationMiddleware(container.getInstance('AuthenticationTokenManager'));
  const adminVerifier = AdminVerifier(container.getInstance('UserRepository'));

  router.post('/customers', authenticationMiddleware, customersController.postAddCustomer);
  router.get('/customers', authenticationMiddleware, adminVerifier, customersController.getCustomers);

  return router;
};

export default customersRoutes;
