/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
import express from 'express';
import errorHandler from '../../Interfaces/middlewares/errorHanlder.js';
import authenticationMiddleware from '../../Interfaces/middlewares/authMiddleware.js';
import usersRoutes from '../../Interfaces/routes/usersRoutes.js';
import authenticationsRoutes from '../../Interfaces/routes/authenticationsRoutes.js';
import productsRoutes from '../../Interfaces/routes/productsRoutes.js';

const createServer = async (container) => {
  const server = express();

  server.use(express.json());

  // routes
  // Home

  // Users
  server.use(usersRoutes(container));

  // Authentications
  server.use(authenticationsRoutes(container));

  // Products
  server.use(productsRoutes(container));

  // Error handling middleware
  server.use(errorHandler);

  // Aurhorization Middleware
  server.use(authenticationMiddleware(container.getInstance('tokenManager')));

  return server;
};

export default createServer;
