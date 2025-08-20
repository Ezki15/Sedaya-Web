class GetOrderUseCase {
  constructor({ orderRepository }) {
    this._orderRepository = orderRepository;
  }

  async execute(credential, orderId) {
    await this._orderRepository.validateAvailableOrder(orderId);

    const { orders, itemsOrder } = await this._orderRepository.getOrderById(credential);

    const orderByUser = orders.reduce((acc, order) => {
      const orderItems = itemsOrder
        .filter((item) => item.order_id === order.orderid)
        .map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
          subtotal: Number(item.subtotal),
        }));

      const formattedOrder = {
        id: order.orderid,
        status: order.status,
        totalPrice: Number(order.total_price),
        items: orderItems,
      };

      // cek apakah owner sudah ada di accumulator
      let ownerGroup = acc.find((group) => group.fullname === order.fullname);
      if (!ownerGroup) {
        ownerGroup = { owner: order.fullname, orders: [] };
        acc.push(ownerGroup);
      }

      ownerGroup.orders.push(formattedOrder);

      return acc;
    }, []);

    return orderByUser;
  }
}

export default GetOrderUseCase;
