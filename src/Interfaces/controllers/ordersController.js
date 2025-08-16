import AddOrderUseCase from '../../Applications/use_cases/AddOrderUseCase.js';

class OrdersController {
  constructor(container) {
    this._container = container;

    this.postAddOrder = this.postAddOrder.bind(this);
  }

  async postAddOrder(req, res) {
    const addOrderUseCase = this._container.getInstance(AddOrderUseCase.name);
    const orderPayload = req.body;
    const userId = req.auth.id;

    const addedOrder = await addOrderUseCase.execute(orderPayload, userId);
    return res.status(201).json({ status: 'success', data: addedOrder });
  }
}

export default OrdersController;
