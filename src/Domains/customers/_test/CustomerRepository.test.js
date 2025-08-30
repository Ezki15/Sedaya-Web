import CustomerRepository from '../CustomerRepository.js';

describe('CustomerRepository interface', () => {
  it('should throw error when invoke abstrct behavior', async () => {
    const customerRepository = new CustomerRepository();

    await expect(customerRepository.addUser('')).rejects.toThrow('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(customerRepository.validateAvailableCustomer('')).rejects.toThrow('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(customerRepository.getAllCustomers()).rejects.toThrow('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(customerRepository.getCustomerById('')).rejects.toThrow('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(customerRepository.updateCustomerById('')).rejects.toThrow('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(customerRepository.deleteCustomerById('')).rejects.toThrow('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
