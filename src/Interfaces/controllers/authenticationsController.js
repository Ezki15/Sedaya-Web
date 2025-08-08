/* eslint-disable max-len */
import LoginUserUseCase from '../../Applications/use_cases/LoginUserUseCase.js';
import RefreshAuthenticationUseCase from '../../Applications/use_cases/RefreshAuthenticationUseCase.js';
import LogoutUserUseCase from '../../Applications/use_cases/LogoutUserUseCase.js';

class AuthenticationsController {
  constructor(container) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req, res) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
    const loggedInUser = await loginUserUseCase.execute(req.body);
    return res.status(201).json({ status: 'success', data: loggedInUser });
  }

  async putAuthenticationHandler(req, res) {
    const refreshAuthenticationUseCase = this._container.getInstance(RefreshAuthenticationUseCase.name);
    const accessToken = await refreshAuthenticationUseCase.execute(req.body);

    return res.status(200).json({ status: 'success', data: accessToken });
  }

  async deleteAuthenticationHandler(req, res) {
    const logoutUserUserCase = this._container.getInstance(LogoutUserUseCase.name);
    await logoutUserUserCase.execute(req.body);
    return res.status(200).json({ status: 'success' });
  }
}

export default AuthenticationsController;
