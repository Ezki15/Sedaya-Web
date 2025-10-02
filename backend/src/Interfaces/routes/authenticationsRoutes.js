import { Router } from 'express';
import AuthenticationsController from '../controllers/authenticationsController.js';
import AuthenticationMiddleware from '../middlewares/authMiddleware.js';

// injecting dependencies
const authenticationsRoutes = (container) => {
  const router = Router();
  const authController = new AuthenticationsController(container);
  const authenticationMiddleware = AuthenticationMiddleware(container.getInstance('AuthenticationTokenManager'));

  router.post('/authentications', authController.postAuthenticationHandler);
  router.put('/authentications', authController.putAuthenticationHandler);
  router.delete('/authentications', authController.deleteAuthenticationHandler);
  router.get('/authentications/me', authenticationMiddleware, authController.getAuthenticationHandler);

  return router;
};

export default authenticationsRoutes;
