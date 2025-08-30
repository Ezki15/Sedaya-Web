/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import CustomerRepository from '../../../Domains/customers/CustomerRepository.js';
import GetSingleCustomerUseCase from '../GetSingleCustomerUseCase.js';

describe('GetCustomersUseCase', () => {
  it('should orchrestrate the get customer by id use case correctly', async () => {
    // Arrange
    const mockCustomers = { id: 'customer-123', name: 'User App 1', phone: '083362736839', address: 'Jawa' };
    const customerId = 'customer-123';

    const mockCustomerRepository = new CustomerRepository();
    mockCustomerRepository.validateAvailableCustomer = jest.fn().mockImplementation(() => Promise.resolve());
    mockCustomerRepository.getCustomerById = jest.fn().mockResolvedValue(mockCustomers);

    const getCustomersUseCase = new GetSingleCustomerUseCase({
      customerRepository: mockCustomerRepository,
    });

    // Action
    const customers = await getCustomersUseCase.execute(customerId);

    // Assert
    expect(customers).toEqual(mockCustomers);
    expect(mockCustomerRepository.getCustomerById).toHaveBeenCalled();
  });

  it('should throw error when use case not contain needed argument', async () => {
    // Arrange
    const customerId = '';
    const getCustomersUseCase = new GetSingleCustomerUseCase({});

    // Action & assert
    await expect(getCustomersUseCase.execute(customerId)).rejects.toThrow('GET_SINGLE_CUSTOMER_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when argument not meet data type specification', async () => {
    // Arrange
    const customerId = 123; // Invalid type, should be a string
    const getCustomersUseCase = new GetSingleCustomerUseCase({});

    // Action & assert
    await expect(getCustomersUseCase.execute(customerId)).rejects.toThrow('GET_SINGLE_CUSTOMER_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when prodcut is not available', async () => {
    // Arrange
    const customerId = 'customer-123';
    const mockCustomerRepository = new CustomerRepository();
    mockCustomerRepository.validateAvailableCustomer = jest.fn().mockImplementation(() => {
      throw new Error('Customer tidak ada');
    });
    const getCustomersUseCase = new GetSingleCustomerUseCase({
      customerRepository: mockCustomerRepository,
    });

    // Action & assert
    await expect(getCustomersUseCase.execute(customerId)).rejects.toThrow('Customer tidak ada');
  });
});
