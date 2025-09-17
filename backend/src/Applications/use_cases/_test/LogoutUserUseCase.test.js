/* eslint-disable max-len */
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository';
import LogoutUserUseCase from '../LogoutUserUseCase';

describe('LogoutUserUseCase', () => {
  it('should orchestrating the logout user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken123',
    };
    const mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn().mockImplementation(() => Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await logoutUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
