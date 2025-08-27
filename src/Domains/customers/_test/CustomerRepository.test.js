import CustomerRepository from '../CustomerRepository.js';

describe('CustomerRepository interface', () => {
  it('should throw error when invoke abstrct behavior', async () => {
    const customerRepository = new CustomerRepository();

    await expect(customerRepository.addUser()).rejects.toThrow('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(customerRepository.verifyAvailableEmail()).rejects.toThrow('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(customerRepository.getPasswordByEmail()).rejects.toThrow('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(customerRepository.getIdByEmail()).rejects.toThrow('CUSTOMER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
