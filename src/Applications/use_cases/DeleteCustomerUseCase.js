class DeleteCustomerUseCase {
  constructor({ customerRepository }) {
    this._customerRepository = customerRepository;
  }

  async execute(customerId) {
    await this._customerRepository.validateAvailableCustomer(customerId);
    await this._customerRepository.deleteCustomerById(customerId);
  }
}

export default DeleteCustomerUseCase;
