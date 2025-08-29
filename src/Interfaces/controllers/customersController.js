import AddCustomerUseCase from '../../Applications/use_cases/AddCustomerUseCase.js';

class CustomersController {
  constructor(container) {
    this._container = container;

    this.postAddCustomer = this.postAddCustomer.bind(this);
  }

  async postAddCustomer(req, res) {
    const userId = req.auth.id;
    const customerPayload = req.body;
    const addCustomerUseCase = this._container.getInstance(AddCustomerUseCase.name);

    const addedCustomer = await addCustomerUseCase.execute(customerPayload, userId);
    return res.status(201).json({ status: 'success', data: addedCustomer });
  }
}

export default CustomersController;
