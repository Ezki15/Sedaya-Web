/* eslint-disable max-len */
import UpdatedCustomer from '../../Domains/customers/entities/UpdatedCustomer.js';

class UpdateCustomerUseCase {
  constructor({ customerRepository }) {
    this._customerRepository = customerRepository;
  }

  async execute(customerId, userId, useCasePayload) {
    await this._customerRepository.validateAvailableCustomer(customerId);
    const oldData = await this._customerRepository.getCustomerById(customerId);
    const updateData = await this._customerRepository.updateCustomerById(customerId, new UpdatedCustomer(useCasePayload, userId));

    return {
      ...oldData,
      ...updateData,
    };
  }
}

export default UpdateCustomerUseCase;
