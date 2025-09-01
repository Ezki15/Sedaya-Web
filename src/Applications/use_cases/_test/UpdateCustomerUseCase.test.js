/* eslint-disable max-len */
import UpdateCustomerUseCase from '../UpdateCustomerUseCase.js';
import UpdatedCustomer from '../../../Domains/customers/entities/UpdatedCustomer.js';
import CustomerRepository from '../../../Domains/customers/CustomerRepository.js';

describe('UpdateCustomerUseCase', () => {
  it('should orchestrating the update Customer action correcly', async () => {
    // Arrange
    const oldPayload = {
      name: 'Customer A',
      email: 'customer@gmail.com',
      phone: '082736483929',
      address: 'Lombok Lama',
    };
    const customerId = 'customer-123';
    const userId = 'user-123';

    const updatePayload = {
      name: 'Customer B',
      email: 'customer@gmail.com',
      phone: '082736483929',
      address: 'Lombok Baru',
    };

    const expectedUpdatedCustomer = {
      ...updatePayload,
    };

    const mockCustomerRepository = new CustomerRepository();
    mockCustomerRepository.validateAvailableCustomer = jest.fn().mockImplementation(() => Promise.resolve());
    mockCustomerRepository.getCustomerById = jest.fn().mockImplementation(() => Promise.resolve(oldPayload));
    mockCustomerRepository.updateCustomerById = jest.fn().mockImplementation(() => Promise.resolve(expectedUpdatedCustomer));

    const updateCustomerUseCase = new UpdateCustomerUseCase({
      customerRepository: mockCustomerRepository,
    });

    // Action
    const updatedCustomer = await updateCustomerUseCase.execute(customerId, userId, updatePayload);

    // Assert
    expect(updatedCustomer).toStrictEqual(expectedUpdatedCustomer);
    expect(mockCustomerRepository.updateCustomerById).toHaveBeenCalledWith(customerId, new UpdatedCustomer(updatePayload, userId));
    expect(mockCustomerRepository.updateCustomerById).toHaveBeenCalledTimes(1);
  });
});
