/* eslint-disable no-underscore-dangle */
import RegisterUser from '../../Domains/users/entities/RegisterUser.js';

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);

    await this._userRepository.verifyAvailableUsername(registerUser.username);
    await this._userRepository.verifyAvailableEmail(registerUser.email);
    registerUser.password = await this._passwordHash.hash(registerUser.password);
    return this._userRepository.addUser(registerUser);
  }
}

export default AddUserUseCase;
