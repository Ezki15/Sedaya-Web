/* eslint-disable no-underscore-dangle */
import RegisterUser from '../../Domains/users/entities/RegisterUser';

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const {
      fullname, username, email, password,
    } = useCasePayload;

    await this._userRepository.verifyAvailableUseraneme(username);
    await this._userRepository.verifyAvailableEmail(email);

    const encryptedPassword = await this._passwordHash.hash(password);

    const newUser = new RegisterUser({
      fullname,
      username,
      email,
      password: encryptedPassword,
    });

    return this._userRepository.addUser(newUser);
  }
}

export default AddUserUseCase;
