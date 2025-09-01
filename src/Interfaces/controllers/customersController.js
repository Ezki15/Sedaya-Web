import AddCustomerUseCase from '../../Applications/use_cases/AddCustomerUseCase.js';
import GetCustomersUseCase from '../../Applications/use_cases/GetCustomersUseCase.js';
import GetSingleCustomerUseCase from '../../Applications/use_cases/GetSingleCustomerUseCase.js';
import UpdateCustomerUseCase from '../../Applications/use_cases/UpdateCustomerUseCase.js';

class CustomersController {
  constructor(container) {
    this._container = container;

    this.postAddCustomer = this.postAddCustomer.bind(this);
    this.getCustomers = this.getCustomers.bind(this);
    this.getSingleCustomer = this.getSingleCustomer.bind(this);
    this.updateCustomer = this.updateCustomer.bind(this);
  }

  async postAddCustomer(req, res) {
    const userId = req.auth.id;
    const customerPayload = req.body;
    const addCustomerUseCase = this._container.getInstance(AddCustomerUseCase.name);

    const addedCustomer = await addCustomerUseCase.execute(customerPayload, userId);
    return res.status(201).json({ status: 'success', data: addedCustomer });
  }

  async getCustomers(req, res) {
    const getCustomersUseCase = this._container.getInstance(GetCustomersUseCase.name);
    const customers = await getCustomersUseCase.execute();
    return res.status(200).json({ status: 'success', data: customers });
  }

  async getSingleCustomer(req, res) {
    const customerId = req.params.id;
    const getSingleCustomerUseCase = this._container.getInstance(GetSingleCustomerUseCase.name);
    const customer = await getSingleCustomerUseCase.execute(customerId);
    return res.status(200).json({ status: 'success', data: customer });
  }

  async updateCustomer(req, res) {
    const customerId = req.params.id;
    const userId = req.auth.id;
    const updatedPayload = req.body;
    const updateCustomerUseCase = this._container.getInstance(UpdateCustomerUseCase.name);
    const updatedCustomer = await updateCustomerUseCase.execute(customerId, userId, updatedPayload);
    return res.status(200).json({ status: 'success', data: updatedCustomer });
  }
}

export default CustomersController;
