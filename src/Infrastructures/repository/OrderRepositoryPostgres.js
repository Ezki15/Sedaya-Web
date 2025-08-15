/* eslint-disable max-len */
/* eslint-disable max-len */
import OrderRepository from '../../Domains/orders/OrderRepository.js';

class OrderRepositoryPostgres extends OrderRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addOrder(newOrder) {
    const id = `order-${this._idGenerator()}`;
    const { totalPrice } = newOrder;
    const { owner } = newOrder;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const status = 'pending'; // Default status for new orders
    const isDeleted = false; // Default value for is_deleted

    const query = {
      text: 'INSERT INTO orders (id, user_id, total_price, status, created_at, updated_at, is_deleted) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, total_price, status',
      values: [id, owner, totalPrice, status, createdAt, updatedAt, isDeleted],
    };

    const result = await this._pool.query(query);
    return {
      id: result.rows[0].id,
      totalPrice: Number(result.rows[0].total_price),
      status: result.rows[0].status,
    };
  }

  // Additional methods like findOrderById can be implemented here
}

export default OrderRepositoryPostgres;
