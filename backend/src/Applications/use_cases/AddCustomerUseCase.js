import NewCustomer from '../../Domains/customers/entities/NewCustomer.js';

class AddCustomerUseCase {
  constructor({ customerRepository }) {
    this._customerRepository = customerRepository;
  }

  async execute(useCasePayload, userId) {
    const newCustomer = new NewCustomer(useCasePayload, userId);
    return this._customerRepository.addCustomer(newCustomer);
  }
}

export default AddCustomerUseCase;
