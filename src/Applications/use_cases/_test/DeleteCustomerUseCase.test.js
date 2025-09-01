/* eslint-disable max-len */
import CustomerRepository from '../../../Domains/customers/CustomerRepository.js';
import DeleteCustomerUseCase from '../DeleteCustomerUseCase.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('DeleteCustomerUseCase', () => {
  it('should throw NotFoundError when Customer is not found', async () => {
    // Arrange
    const customerId = 'customer-123';

    const mockCustomerRepository = new CustomerRepository();
    mockCustomerRepository.validateAvailableCustomer = jest.fn().mockImplementation(() => {
      throw new NotFoundError('Customer tidak ditemukan');
    });

    const deleteCustomerUseCase = new DeleteCustomerUseCase({
      customerRepository: mockCustomerRepository,
    });

    // Act & Assert
    await expect(deleteCustomerUseCase.execute(customerId)).rejects.toThrow(NotFoundError);
  });

  it('should orchestrating the delete customer successfully', async () => {
    // Arrange
    const customerId = 'customer-123';

    const mockCustomerRepository = new CustomerRepository();
    mockCustomerRepository.validateAvailableCustomer = jest.fn().mockImplementation(() => Promise.resolve());
    mockCustomerRepository.deleteCustomerById = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCustomerUseCase = new DeleteCustomerUseCase({
      customerRepository: mockCustomerRepository,
    });

    // Act
    await deleteCustomerUseCase.execute(customerId);

    // Assert
    expect(mockCustomerRepository.validateAvailableCustomer).toHaveBeenCalledWith(customerId);
    expect(mockCustomerRepository.deleteCustomerById).toHaveBeenCalledWith(customerId);
  });
});
