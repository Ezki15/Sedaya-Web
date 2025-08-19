class GetAllOrdersUseCase {
  constructor({ orderRepository }) {
    this._orderRepository = orderRepository;
  }

  async execute() {
    return this._orderRepository.getAllOrders();
  }
}

export default GetAllOrdersUseCase;
