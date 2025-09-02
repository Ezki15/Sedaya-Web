/* eslint-disable max-len */
import NewCustomer from '../../../Domains/customers/entities/NewCustomer.js';
import CustomerRepository from '../../../Domains/customers/CustomerRepository.js';
import AddCustomerUseCase from '../AddCustomerUseCase.js';

describe('AddCustomerUseCase', () => {
  it('should orchestrating the add custome action correctly', async () => {
    // Arrange
    const useCasePayload = {
      name: 'Use App',
      email: 'user23@gmail.com',
      phone: '6282338746726',
      address: 'Lombok Timur',
    };

    const expectedAddedCustomer = { id: 'customer-123', name: 'User App' };

    const userId = 'user-123';

    const mockCustomerRepository = new CustomerRepository();
    mockCustomerRepository.addCustomer = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedCustomer));

    const addCustomerUseCase = new AddCustomerUseCase({
      customerRepository: mockCustomerRepository,
    });

    // Action
    const newCustomer = await addCustomerUseCase.execute(useCasePayload, userId);

    // Assert
    expect(newCustomer).toStrictEqual(expectedAddedCustomer);
    expect(mockCustomerRepository.addCustomer).toHaveBeenCalledTimes(1);
    expect(mockCustomerRepository.addCustomer).toHaveBeenCalledWith(new NewCustomer({
      name: useCasePayload.name,
      email: useCasePayload.email,
      phone: useCasePayload.phone,
      address: useCasePayload.address,
    }, userId));
  });
});
