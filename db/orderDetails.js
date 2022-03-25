const client = require("./client");

const addProductToOrder = async ({
  orderId,
  productId,
  quantity,
  unitPrice,
  createdAt,
}) => {
  try {
    const {
      rows: [orderDetail],
    } = await client.query(
      `
        INSERT INTO orderDetails("orderId", "productId", quantity, "unitPrice", "createdAt")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
      [orderId, productId, quantity, unitPrice, createdAt]
    );
    return orderDetail;
  } catch (error) {
    throw error;
  }
};

const getProductByOrderId = async ({ orderId }) => {
  try {
    const {
      rows: [orderDetail],
    } = await client.query(
      `
        SELECT * 
        FROM orderDetails 
        WHERE "orderId" = $1
        `,
      [orderId]
    );

    return orderDetail;
  } catch (error) {
    throw error;
  }
};

//!Why do we need this function?
// const getOrderByDate = async({createdAt}) => {
//     try{
//         const {rows }= await client.query(`
//             SELECT *
//             FROM orderDetails
//             WHERE "createdAt" = $1
//         `,[createdAt])
//         return rows
//     }catch(error){
//         throw error;
//     }
// }

//updates the quantity/amount of a product for orderDetails
const updateQuantity = async (id, quanity) => {
  try {
    const {
      rows: [updatedQuantity],
    } = await client.query(
      `
        UPDATE orderDetails
        SET quantity = ${quanity}
        WHERE id = ${id}
        RETURNING *;
      `
    );
    return updatedQuantity;
  } catch (err) {
    throw err;
  }
};

//deletes an item off an order
const deleteItem = async (id) => {
  try {
    const {
      rows: [deletedItem],
    } = await client.query(
      `
            DELETE FROM orderDetails
            WHERE "id" = $1
            RETURNING orderDetails.id;
        `,
      [id]
    );

    return deletedItem;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addProductToOrder,
  getProductByOrderId,
  //   getOrderByDate,
  updateQuantity,
  deleteItem,
};
