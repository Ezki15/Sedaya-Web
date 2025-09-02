import CustomerRepository from '../../../Domains/customers/CustomerRepository.js';
import GetCustomersUseCase from '../GetCustomersUseCase.js';

describe('GetCustomersUseCase', () => {
  it('should orchrestrate the get customers use case correctly', async () => {
    // Arrange
    const mockCustomers = [
      {
        id: 'customer-123', name: 'User App 1', phone: '083362736839', address: 'Jawa',
      },
      {
        id: 'customer-234', name: 'User App 2', phone: '082374837493', address: 'Sumatra',
      },
    ];

    const mockCustomerRepository = new CustomerRepository();
    mockCustomerRepository.getAllCustomers = jest.fn().mockResolvedValue(mockCustomers);

    const getCustomersUseCase = new GetCustomersUseCase({
      customerRepository: mockCustomerRepository,
    });

    // Action
    const customers = await getCustomersUseCase.execute();

    // Assert
    expect(customers).toEqual(mockCustomers);
    expect(mockCustomerRepository.getAllCustomers).toHaveBeenCalled();
  });
});
