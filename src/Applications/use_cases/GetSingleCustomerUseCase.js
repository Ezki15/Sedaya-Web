class GetSingleCustomerUseCase {
  constructor({ customerRepository }) {
    this._customerRepository = customerRepository;
  }

  async execute(customerId) {
    this._validateId(customerId);
    await this._customerRepository.validateAvailableCustomer(customerId);
    return this._customerRepository.getCustomerById(customerId);
  }

  _validateId(customerId) {
    if (!customerId) {
      throw new Error('GET_SINGLE_CUSTOMER_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof customerId !== 'string') {
      throw new Error('GET_SINGLE_CUSTOMER_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default GetSingleCustomerUseCase;
