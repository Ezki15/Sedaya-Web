import LoginUserUseCase from '../../Applications/use_cases/LoginUserUseCase.js';

class AuthenticationsController {
  constructor(container) {
    this._container = container;

    this.postLoginUser = this.postLoginUser.bind(this);
  }

  async postLoginUser(req, res) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
    const loggedInUser = await loginUserUseCase.execute(req.body);
    return res.status(201).json({ status: 'success', data: loggedInUser });
  }
}

export default AuthenticationsController;