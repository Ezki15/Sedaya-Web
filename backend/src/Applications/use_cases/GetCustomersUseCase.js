class GetCustomersUseCase {
  constructor({ customerRepository }) {
    this._customerRepository = customerRepository;
  }

  async execute() {
    return this._customerRepository.getAllCustomers();
  }
}

export default GetCustomersUseCase;
