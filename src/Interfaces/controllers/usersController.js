/* istanbul ignore file */

import AddUserUseCase from '../../Applications/use_cases/AddUserUseCase.js';

class UsersController {
  constructor(container) {
    this._container = container;

    this.postRegisterUser = this.postRegisterUser.bind(this);
  }

  async postRegisterUser(req, res) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(req.body);
    return res.status(201).json({status: 'success', data: addedUser });
  }
}

export default UsersController;
