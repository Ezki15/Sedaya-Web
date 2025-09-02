/* eslint-disable max-len */
/* eslint-disable max-len */
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import OrderRepository from '../../Domains/orders/OrderRepository.js';

class OrderRepositoryPostgres extends OrderRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addOrder(newOrder) {
    const client = await this._pool.connect(); // ambil koneksi biar transaksi konsisten
    try {
      await client.query('BEGIN'); // mulai transaksi

      const orderId = `order-${this._idGenerator()}`;
      const { totalPrice, owner, products } = newOrder;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      const status = 'pending';
      const isDeleted = false;

      // Insert ke tabel orders dulu
      const orderQuery = {
        text: `
          INSERT INTO orders (id, user_id, total_price, status, created_at, updated_at, is_deleted)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, total_price, status
        `,
        values: [orderId, owner, totalPrice, status, createdAt, updatedAt, isDeleted],
      };

      const orderResult = await client.query(orderQuery);

      // Insert ke order_items
      const queries = products.map((product) => {
        const orderItemId = `order_item-${this._idGenerator()}`;
        const subtotal = product.price * product.quantity;
        return client.query(
          'INSERT INTO order_items (id, order_id, product_id, quantity, price, subtotal) VALUES($1, $2, $3, $4, $5, $6)',
          [orderItemId, orderId, product.productId, product.quantity, product.price, subtotal],
        );
      });

      await Promise.all(queries);

      await client.query('COMMIT'); // simpan semua
      return {
        id: orderResult.rows[0].id,
        totalPrice: Number(orderResult.rows[0].total_price),
        status: orderResult.rows[0].status,
      };
    } catch (error) {
      await client.query('ROLLBACK'); // batalkan semua kalau gagal
      throw error;
    } finally {
      client.release(); // balikin client ke pool
    }
  }

  async validateAvailableOrder(orderId) {
    const isDeleted = false;
    const query = {
      text: 'SELECT id FROM orders WHERE id = $1 AND is_deleted = $2',
      values: [orderId, isDeleted],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Order tidak ada');
    }
  }

  async getAllOrders() {
    const isDeleted = false;
    const queryOrders = {
      text: 'SELECT id as orderId, user_id as owner, status, total_price as totalPrice FROM orders WHERE is_deleted = $1',
      values: [isDeleted],
    };

    const orders = await this._pool.query(queryOrders);

    const queryItems = {
      text: `SELECT o.order_id, p.name, o.quantity, o.price, o.subtotal 
              FROM order_items as o
              LEFT JOIN products as p 
              ON p.id = o.product_id`,
    };

    const itemsOrder = await this._pool.query(queryItems);

    return { orders: orders.rows, itemsOrder: itemsOrder.rows };
  }

  async getOrderById(userId) {
    const isDeleted = false;
    const queryOrders = {
      text: `SELECT o.id as orderid, o.user_id, u.fullname, o.status, o.total_price as totalPrice
             FROM orders as o 
             LEFT JOIN users as u
             ON u.id = o.user_id
             WHERE o.is_deleted = $1 AND o.user_id = $2`,
      values: [isDeleted, userId],
    };

    const orders = await this._pool.query(queryOrders);
    const getOrderId = orders.rows[0].orderid;

    const queryItems = {
      text: `SELECT o.order_id, p.name, o.product_id, o.quantity, o.price, o.subtotal 
              FROM order_items as o
              LEFT JOIN products as p 
              ON p.id = o.product_id
              WHERE o.order_id = $1`,
      values: [getOrderId],
    };

    const itemsOrder = await this._pool.query(queryItems);

    return { orders: orders.rows, itemsOrder: itemsOrder.rows };
  }

  async updateOrder(payload) {
    const { orderId, status } = payload;
    const updateAt = new Date().toISOString();
    const query = {
      text: `UPDATE orders SET status = $1, 
                              updated_at = $2 
                              WHERE id = $3 RETURNING id, status`,
      values: [status, updateAt, orderId],
    };

    const result = await this._pool.query(query);

    return {
      orderId: result.rows[0].id,
      status: result.rows[0].status,
    };
  }
}

export default OrderRepositoryPostgres;
