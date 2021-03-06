const client = require("./client");

//adds current products that is in the cart
const addCurrentItemsToOrder = async (orders) => {
  try {
    const orderIdArray = orders.map((order) => {
      return order.id;
    });

    const { rows: products } = await client.query(`
      SELECT products.id AS "productId", 
      orderDetails.id AS "orderDetailId", 
      orderDetails.quantity, products.name, orderDetails."unitPrice", orderDetails."orderId",
      products."productImg" 
      FROM products 
      JOIN orderDetails ON products.id = orderDetails."productId"
      WHERE orderDetails."orderId" IN (${orderIdArray});
      `);

    orders.forEach((order) => {
      order.items = products.filter((product) => order.id === product.orderId);
    });

    return orders;
  } catch (error) {
    throw error;
  }
};

//createOrders creates an order
async function createOrders({ userId, orderTotal, createdAt, isActive }) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
        INSERT INTO orders("userId", "orderTotal", "createdAt", "isActive")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
      [userId, orderTotal, createdAt, isActive]
    );
    return order;
  } catch (error) {
    throw error;
  }
}

// getsAllOrders
// selects and returns all order on db,  not including their items
// maybe for an admin to look over all previous orders
const getAllOrders = async () => {
  try {
    const { rows: orders } = await client.query(
      `
        SELECT orders.*, users.username AS "shopperName" FROM orders
        JOIN users ON orders."userId" = users.id
        `,
      []
    );
    return orders;
  } catch (error) {
    throw error;
  }
};

//getOrderById gets a single order by id, does not include products
async function getOrderById(id) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
            SELECT * 
            FROM orders
            WHERE id = $1
        `,
      [id]
    );

    return order;
  } catch (error) {
    throw error;
  }
}

//getOrdersByUserId
// gets all orders made by a user, includes items on the order itself
async function getOrdersByUserId(userId) {
  try {
    const { rows: orders } = await client.query(
      `
            SELECT * 
            FROM orders
            WHERE "userId" = $1
        `,
      [userId]
    );

    if (orders.length === 0) {
      return;
    }

    return await addCurrentItemsToOrder(orders);
  } catch (error) {
    throw error;
  }
}

async function updateOrder(orderFields) {
  const orderId = orderFields.id;
  delete orderFields.id;
  const setString = Object.keys(orderFields)
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [updatedOrder],
    } = await client.query(
      `
      UPDATE orders
      SET ${setString}
      WHERE id = ${orderId}
      RETURNING *;
      `,
      Object.values(orderFields)
    );
    return updatedOrder;
  } catch (error) {
    throw error;
  }
}

// removes an order from the database table admin use
async function deleteOrder(id) {
  try {
    await client.query(
      `
            DELETE FROM orders
            WHERE id = ${id}
        `
    );

    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createOrders,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  deleteOrder,
};
