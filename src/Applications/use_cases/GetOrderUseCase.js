class GetOrderUseCase {
  constructor({ orderRepository }) {
    this._orderRepository = orderRepository;
  }

  async execute(credential, orderId) {
    await this._orderRepository.validateAvailableOrder(orderId);

    const { orders, itemsOrder } = await this._orderRepository.getOrderById(credential);

    const orderByUser = {
      id: orders.orderid,
      owner: orders.name,
      status: orders.status,
      orders:
          itemsOrder
            .filter((item) => item.order_id === orders.orderid)
            .map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: Number(item.price),
              subtotal: Number(item.subtotal),
            })),
    };

    return orderByUser;
  }
}

export default GetOrderUseCase;
