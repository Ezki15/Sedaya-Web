import { Router } from 'express';
import AuthenticationsController from '../controllers/authenticationsController.js';

// injecting dependencies
const authenticationsRoutes = (container) => {
  const router = Router();
  const authController = new AuthenticationsController(container);

  router.post('/authentications', authController.postAuthenticationHandler);
  router.put('/authentications', authController.putAuthenticationHandler);
  router.delete('/authentications', authController.deleteAuthenticationHandler);

  return router;
};

export default authenticationsRoutes;
