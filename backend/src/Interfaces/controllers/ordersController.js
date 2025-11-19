import AddOrderUseCase from '../../Applications/use_cases/AddOrderUseCase.js';
import GetAllOrdersUseCase from '../../Applications/use_cases/GetAllOrdersUseCase.js';
import GetOrderUseCase from '../../Applications/use_cases/GetOrderUseCase.js';
import UpdateOrderUseCase from '../../Applications/use_cases/UpdateOrderUseCase.js';

class OrdersController {
  constructor(container) {
    this._container = container;

    this.postAddOrder = this.postAddOrder.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.getOrderById = this.getOrderById.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
  }

  async postAddOrder(req, res) {
    const addOrderUseCase = this._container.getInstance(AddOrderUseCase.name);
    const orderPayload = req.body;
    const userId = req.auth.id;
    console.log(orderPayload);

    const addedOrder = await addOrderUseCase.execute(orderPayload, userId);
    return res.status(201).json({ status: 'success', data: addedOrder });
  }

  async getAllOrders(req, res) {
    const getAllOrdersUseCase = this._container.getInstance(GetAllOrdersUseCase.name);
    const orders = await getAllOrdersUseCase.execute();
    return res.status(200).json({ status: 'success', data: { orders } });
  }

  async getOrderById(req, res) {
    const orderId = req.params.id;
    const credential = req.auth.id;
    const getOrderUseCase = this._container.getInstance(GetOrderUseCase.name);
    const orders = await getOrderUseCase.execute(credential, orderId);
    return res.status(200).json({ status: 'success', data: { orders } });
  }

  async updateOrder(req, res) {
    const updatePayload = req.body;
    const updateOrderUseCase = this._container.getInstance(UpdateOrderUseCase.name);
    const updatedOrder = await updateOrderUseCase.execute(updatePayload);
    return res.status(200).json({ status: 'success', data: updatedOrder });
  }
}

export default OrdersController;
