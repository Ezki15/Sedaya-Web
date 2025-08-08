import { Router } from 'express';
import UsersController from '../controllers/usersController.js';

// injecting dependencies
const usersRoutes = (container) => {
  const router = Router();
  const usersController = new UsersController(container);

  router.post('/auth/users/register', usersController.postRegisterUser);

  return router;
};

export default usersRoutes;
