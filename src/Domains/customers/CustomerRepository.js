/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class CustomerRepository {
  async addUser(newCustomer) {
    throw new Error('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableEmail(username) {
    throw new Error('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getPasswordByEmail(email) {
    throw new Error('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getIdByEmail(email) {
    throw new Error('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default CustomerRepository;
