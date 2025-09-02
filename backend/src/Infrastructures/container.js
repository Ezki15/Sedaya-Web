/* istanbul ignore file */
import { createContainer } from 'instances-container';

// external dependencies
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import pool from './database/postgres/pool.js';

// Service dependencies
// User
import UserRepository from '../Domains/users/UserRepository.js';
import UserRepositoryPostgres from './repository/UserRepositoryPostgres.js';

// Authentication
import PasswordHash from '../Applications/security/PasswordHash.js';
import BcryptPasswordHash from './security/BcryptPasswordHash.js';
import AuthenticationRepository from '../Domains/authentications/AuthenticationRepository.js';
import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres.js';
import JwtTokenManager from './security/JwtTokenManager.js';
import AuthenticationTokenManager from '../Applications/security/AuthenticationTokenManager.js';

// Product
import ProductRepository from '../Domains/products/ProductRepository.js';
import ProductRepositoryPostgres from './repository/ProductRepositoryPostgres.js';

// Orders
import OrderRepository from '../Domains/orders/OrderRepository.js';
import OrderRepositoryPostgres from './repository/OrderRepositoryPostgres.js';

// Customers
import CustomerRepository from '../Domains/customers/CustomerRepository.js';
import CustomerRepositoryPostgres from './repository/CustomerRepositoryPostgres.js';

// use case
// Users
import AddUserUseCase from '../Applications/use_cases/AddUserUseCase.js';

// Authentication
import LoginUserUseCase from '../Applications/use_cases/LoginUserUseCase.js';
import LogoutUserUseCase from '../Applications/use_cases/LogoutUserUseCase.js';
import RefreshAuthenticationUseCase from '../Applications/use_cases/RefreshAuthenticationUseCase.js';

// products
import AddProductUseCase from '../Applications/use_cases/AddProductUseCase.js';
import GetProductsUseCase from '../Applications/use_cases/GetProductsUseCase.js';
import GetSingleProductUseCase from '../Applications/use_cases/GetSingleProductUseCase.js';
import UpdateProductUseCase from '../Applications/use_cases/UpdateProductUseCase.js';
import DeleteProductUseCase from '../Applications/use_cases/DeleteProductUseCase.js';

// Orders
import AddOrderUseCase from '../Applications/use_cases/AddOrderUseCase.js';
import GetAllOrdersUseCase from '../Applications/use_cases/GetAllOrdersUseCase.js';
import GetOrderUseCase from '../Applications/use_cases/GetOrderUseCase.js';
import UpdateOrderUseCase from '../Applications/use_cases/UpdateOrderUseCase.js';

// Customers
import AddCustomerUseCase from '../Applications/use_cases/AddCustomerUseCase.js';
import GetCustomersUseCase from '../Applications/use_cases/GetCustomersUseCase.js';
import GetSingleCustomerUseCase from '../Applications/use_cases/GetSingleCustomerUseCase.js';
import UpdateCustomerUseCase from '../Applications/use_cases/UpdateCustomerUseCase.js';
import DeleteCustomerUseCase from '../Applications/use_cases/DeleteCustomerUseCase.js';

// creating container
const container = createContainer();

// registing services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ProductRepository.name,
    Class: ProductRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid },
      ],
    },
  },
  {
    key: OrderRepository.name,
    Class: OrderRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid },
      ],
    },
  },
  {
    key: CustomerRepository.name,
    Class: CustomerRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        { concrete: bcrypt },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  // Users
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  // Authentications
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  // Products
  {
    key: AddProductUseCase.name,
    Class: AddProductUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'productRepository',
          internal: ProductRepository.name,
        },
      ],
    },
  },
  {
    key: GetProductsUseCase.name,
    Class: GetProductsUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'productRepository',
          internal: ProductRepository.name,
        },
      ],
    },
  },
  {
    key: GetSingleProductUseCase.name,
    Class: GetSingleProductUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'productRepository',
          internal: ProductRepository.name,
        },
      ],
    },
  },
  {
    key: UpdateProductUseCase.name,
    Class: UpdateProductUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'productRepository',
          internal: ProductRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteProductUseCase.name,
    Class: DeleteProductUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'productRepository',
          internal: ProductRepository.name,
        },
      ],
    },
  },
  // Orders
  {
    key: AddOrderUseCase.name,
    Class: AddOrderUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'orderRepository',
          internal: OrderRepository.name,
        },
        {
          name: 'productRepository',
          internal: ProductRepository.name,
        },
      ],
    },
  },
  {
    key: GetAllOrdersUseCase.name,
    Class: GetAllOrdersUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'orderRepository',
          internal: OrderRepository.name,
        },
      ],
    },
  },
  {
    key: GetOrderUseCase.name,
    Class: GetOrderUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'orderRepository',
          internal: OrderRepository.name,
        },
      ],
    },
  },
  {
    key: UpdateOrderUseCase.name,
    Class: UpdateOrderUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'orderRepository',
          internal: OrderRepository.name,
        },
        {
          name: 'productRepository',
          internal: ProductRepository.name,
        },
      ],
    },
  },
  // Customers
  {
    key: AddCustomerUseCase.name,
    Class: AddCustomerUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'customerRepository',
          internal: CustomerRepository.name,
        },
      ],
    },
  },
  {
    key: GetCustomersUseCase.name,
    Class: GetCustomersUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'customerRepository',
          internal: CustomerRepository.name,
        },
      ],
    },
  },
  {
    key: GetSingleCustomerUseCase.name,
    Class: GetSingleCustomerUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'customerRepository',
          internal: CustomerRepository.name,
        },
      ],
    },
  },
  {
    key: UpdateCustomerUseCase.name,
    Class: UpdateCustomerUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'customerRepository',
          internal: CustomerRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCustomerUseCase.name,
    Class: DeleteCustomerUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'customerRepository',
          internal: CustomerRepository.name,
        },
      ],
    },
  },
]);

export default container;
