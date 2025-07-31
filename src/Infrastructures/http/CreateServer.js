/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
import express from 'express';
import errorHandler from '../../Interfaces/middlewares/errorHanlder.js';
import usersRoutes from '../../Interfaces/routes/usersRoutes.js';
import authenticationsRoutes from '../../Interfaces/routes/authenticationsRoutes.js';

const createServer = async (container) => {
  const server = express();

  server.use(express.json());

  // routes
  // Home

  // Users
  server.use(usersRoutes(container));

  // Authentications
  server.use(authenticationsRoutes(container));

  // Error handling middleware
  server.use(errorHandler);

  
  return server;
};

export default createServer;
