/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
import express from 'express';
import errorHandler from '../../Interfaces/middlewares/errorHanlder.js';
import usersRoutes from '../../Interfaces/routes/usersRoutes.js';

const createServer = async (container) => {
  const server = express();

  server.use(express.json());

  // routes
  // Home

  // Users
  server.use(usersRoutes(container));

  // Error handling middleware
  server.use(errorHandler);

  
  return server;
};

export default createServer;
