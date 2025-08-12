/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('order_items', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    order_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    product_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    quantity: {
      type: 'INTEGER', // Number of units of the product in the order
      notNull: true,
    },
    price: {
      type: 'NUMERIC', // Price per unit of the product at the time of order
      notNull: true,
    },
    subtotal: {
      type: 'NUMERIC', // Calculated as quantity * price
      notNull: true,
    },
  });
  pgm.addConstraint('order_items', 'fk_order_items.order_id_to_orders.id', {
    foreignKeys: {
      columns: 'order_id',
      references: 'orders(id)',
      onDelete: 'CASCADE',
    },
  });
  pgm.addConstraint('order_items', 'fk_order_items.product_id_to_products.id', {
    foreignKeys: {
      columns: 'product_id',
      references: 'products(id)',
      onDelete: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('order_items');
  pgm.dropConstraint('order_items', 'fk_order_items.order_id_to_orders.id');
  pgm.dropConstraint('order_items', 'fk_order_items.product_id_to_products.id');
};
