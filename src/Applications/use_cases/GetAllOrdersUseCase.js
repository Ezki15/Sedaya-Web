class GetAllOrdersUseCase {
  constructor({ orderRepository }) {
    this._orderRepository = orderRepository;
  }

  async execute() {
    const { orders, itemsOrder } = await this._orderRepository.getAllOrders();

    // Kelompokkan orders by owner
    const groupedByOwner = orders.reduce((acc, order) => {
      const orderItems = itemsOrder
        .filter((item) => item.orderId === order.id)
        .map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        }));

      const formattedOrder = {
        id: order.orderId,
        status: order.status,
        totalPrice: order.totalPrice,
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

    return groupedByOwner;
  }
}

export default GetAllOrdersUseCase;
