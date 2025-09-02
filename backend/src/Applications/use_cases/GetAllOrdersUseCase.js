class GetAllOrdersUseCase {
  constructor({ orderRepository }) {
    this._orderRepository = orderRepository;
  }

  async execute() {
    const { orders, itemsOrder } = await this._orderRepository.getAllOrders();

    // Kelompokkan orders by owner
    const groupedByOwner = orders.reduce((acc, order) => {
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
      let ownerGroup = acc.find((group) => group.owner === order.owner);
      if (!ownerGroup) {
        ownerGroup = { owner: order.owner, orders: [] };
        acc.push(ownerGroup);
      }

      ownerGroup.orders.push(formattedOrder);

      return acc;
    }, []);

    // console.dir(groupedByOwner, { depth: null });

    return groupedByOwner;
  }
}

export default GetAllOrdersUseCase;
