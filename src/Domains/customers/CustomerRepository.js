/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class CustomerRepository {
  async addUser(newCustomer) {
    throw new Error('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getAllCustomer() {
    throw new Error('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCustomerById(customerId) {
    throw new Error('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async updateCustomerById(customerId, updatePayload) {
    throw new Error('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCustomerById(customerId) {
    throw new Error('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default CustomerRepository;
