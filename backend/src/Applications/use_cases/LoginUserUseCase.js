/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
import LoginUser from '../../Domains/users/entities/LoginUser.js';
import NewAuthentication from '../../Domains/authentications/entities/NewAuth.js';

export default class LoginUserUseCase {
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }) {
    this._userRepository = userRepository;
    this._autheticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const { email, password } = new LoginUser(useCasePayload);

    const encryptedPassword = await this._userRepository.getPasswordByEmail(email);

    await this._passwordHash.comparePassword(password, encryptedPassword);

    const id = await this._userRepository.getIdByEmail(email);

    const role = await this._userRepository.getRoleByEmail(email);

    const accessToken = await this._authenticationTokenManager.createAccessToken({ email, id, role });
    const refreshToken = await this._authenticationTokenManager.createRefreshToken({ email, id, role });

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    await this._autheticationRepository.addToken(newAuthentication.refreshToken);

    return newAuthentication;
  }
}
