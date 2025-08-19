/* eslint-disable no-unused-vars */
class OrderRepository {
  async addOrder(orderPayload) {
    throw new Error('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async validateAvailableOrder(orderId) {
    throw new Error('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async updateOrder(updatePayload) {
    throw new Error('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getOrderById(orderId) {
    throw new Error('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getAllOrders() {
    throw new Error('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteOrderById(orderId) {
    throw new Error('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default OrderRepository;
