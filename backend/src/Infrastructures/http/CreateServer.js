/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from '../../Interfaces/middlewares/errorHanlder.js';
import usersRoutes from '../../Interfaces/routes/usersRoutes.js';
import authenticationsRoutes from '../../Interfaces/routes/authenticationsRoutes.js';
import productsRoutes from '../../Interfaces/routes/productsRoutes.js';
import ordersRoutes from '../../Interfaces/routes/ordersRoutes.js';
import customersRoutes from '../../Interfaces/routes/customersRoutes.js';

const createServer = async (container) => {
  const server = express();

  server.use(express.json());
  server.use(cors({
    origin: process.env.FRONTEND_URL, // asal frontend
    credentials: true,
  }));
  server.use(cookieParser());

  // routes
  // Home

  // Users
  server.use(usersRoutes(container));

  // Authentications
  server.use(authenticationsRoutes(container));

  // Products
  server.use(productsRoutes(container));

  // Orders
  server.use(ordersRoutes(container));

  // Customers
  server.use(customersRoutes(container));

  // Error handling middleware
  server.use(errorHandler);

  return server;
};

export default createServer;
