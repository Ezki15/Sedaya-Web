import AuthenticationRepository from '../AuthenticationRepository';

describe('AuthenticationRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepository();

    // Act & Assert
    await expect(authenticationRepository.addToken({})).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationRepository.getToken({})).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationRepository.checkAvailabilityToken({})).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationRepository.deleteToken({})).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
