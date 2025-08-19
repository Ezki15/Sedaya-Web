import AddOrderUseCase from '../../Applications/use_cases/AddOrderUseCase.js';
import GetAllOrdersRepositoryPostgres from '../../Applications/use_cases/GetAllOrdersUseCase.js';

class OrdersController {
  constructor(container) {
    this._container = container;

    this.postAddOrder = this.postAddOrder.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
  }

  async postAddOrder(req, res) {
    const addOrderUseCase = this._container.getInstance(AddOrderUseCase.name);
    const orderPayload = req.body;
    const userId = req.auth.id;

    const addedOrder = await addOrderUseCase.execute(orderPayload, userId);
    return res.status(201).json({ status: 'success', data: addedOrder });
  }

  async getAllOrders(req, res) {
    const getAllOrdersUseCase = this._container.getInstance(GetAllOrdersRepositoryPostgres.name);
    const orders = await getAllOrdersUseCase.execute();
    console.dir(orders, { depth: null });
    return res.status(200).json({ status: 'success', data: { orders } });
  }
}

export default OrdersController;
