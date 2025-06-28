import RegisterUser from '../../../Domains/users/entities/RegisterUser';
import UserRepository from '../../../Domains/users/UserRepository';
import PasswordHash from '../../security/PasswordHash';
import AddUserUseCase from '../AddUserUseCase';

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      fullname: 'Karang Taruna',
      username: 'user123',
      email: 'user12@gmail.com',
      password: 'secret_password',
    };

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUseraneme = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.verifyAvailableEmail = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'user-123',
        fullname: 'Karang Taruna',
        username: 'user123',
        email: 'user12@gmail.com',
      }));

    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await addUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.verifyAvailableUseraneme)
      .toHaveBeenCalledWith(useCasePayload.username);
    expect(mockUserRepository.verifyAvailableEmail)
      .toHaveBeenCalledWith(useCasePayload.email);
    expect(mockPasswordHash.hash)
      .toHaveBeenCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser)
      .toHaveBeenCalledWith(new RegisterUser({
        fullname: useCasePayload.fullname,
        username: useCasePayload.username,
        email: useCasePayload.email,
        password: 'encrypted_password',
      }));
    expect(registeredUser).toStrictEqual({
      id: 'user-123',
      fullname: 'Karang Taruna',
      username: 'user123',
      email: 'user12@gmail.com',
    });
  });
});
