class GetOrderUseCase {
  constructor({ orderRepository }) {
    this._orderRepository = orderRepository;
  }

  async execute(credential, orderId) {
    await this._orderRepository.validateAvailableOrder(orderId);

    const { orders, itemsOrder } = await this._orderRepository.getOrderById(credential);
    // console.log('ini adalah items order', itemsOrder);

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
        totalPrice: Number(order.totalprice),
        items: orderItems,
      };

      // cek apakah owner sudah ada di accumulator
      let ownerGroup = acc.find((group) => group.fullname === order.fullname);
      if (!ownerGroup) {
        ownerGroup = { owner: order.fullname, userId: order.user_id, orders: [] };
        acc.push(ownerGroup);
      }

      ownerGroup.orders.push(formattedOrder);

      return acc;
    }, []);

    // console.dir(orderByUser[0], { depth: null });

    return orderByUser[0];
  }
}

export default GetOrderUseCase;
