/* eslint-disable max-len */
import UserRepository from '../../../Domains/users/UserRepository';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager';
import PasswordHash from '../../security/PasswordHash';
import LoginUserUseCase from '../LoginUserUseCase';
import NewAuth from '../../../Domains/authentications/entities/NewAuth';

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      email: 'email123@gmail.com',
      password: 'secret',
    };
    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const mockUserRepository = new UserRepository();
    const mockedAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    // Mocking
    mockUserRepository.getPasswordByEmail = jest.fn().mockImplementation(() => Promise.resolve('encrypt_password'));
    mockPasswordHash.comparePassword = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve(mockedAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn().mockImplementation(() => Promise.resolve(mockedAuthentication.refreshToken));
    mockUserRepository.getIdByEmail = jest.fn().mockImplementation(() => Promise.resolve('user-123'));
    mockedAuthenticationRepository.addToken = jest.fn().mockImplementation(() => Promise.resolve());

    //   create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockedAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    }));
    expect(mockUserRepository.getPasswordByEmail).toHaveBeenCalledWith('email123@gmail.com');
    expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith('secret', 'encrypt_password');
    expect(mockUserRepository.getIdByEmail).toHaveBeenCalledWith('email123@gmail.com');
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ email: 'email123@gmail.com', id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({ email: 'email123@gmail.com', id: 'user-123' });
    expect(mockedAuthenticationRepository.addToken).toHaveBeenCalledWith(mockedAuthentication.refreshToken);
  });
});
