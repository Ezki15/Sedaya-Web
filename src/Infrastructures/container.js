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

// use case
// Users
import AddUserUseCase from '../Applications/use_cases/AddUserUseCase.js';
import LoginUserUseCase from '../Applications/use_cases/LoginUserUseCase.js';
import LogoutUserUseCase from '../Applications/use_cases/LogoutUserUseCase.js';
import AuthenticationTokenManager from '../Applications/security/AuthenticationTokenManager.js';

// Authentication

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
    key: AuthenticationTokenManager,
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
          name: 'passwordHash',
          internal: PasswordHash.name,
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
]);

export default container;
