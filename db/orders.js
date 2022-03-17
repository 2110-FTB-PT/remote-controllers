const client = require('./client');

const createOrder = async({userId, productId, productQuantity, orderSum }) => {
    try{
        const {rows: [order]} = await client.query(`
        INSERT INTO orders("userId", "productId", productQuantity, orderSum)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [userId, productId, productQuantity, orderSum]);
        return order;
    }catch(error){
        throw error;
    }
}

const getAllOrders = async() => {
    try{
        const {rows: order} = await client.query(`
        SELECT orders.*, users.username AS "shopperName"
        FROM products, users
        `, []);
        return order;
    }catch(error){
        throw error;
    }
}

const getOrderbyId = async(id) => {
    try{
        const {rows: order} = await client.query(`
            SELECT * 
            FROM orders
            WHERE id = $1
        `, [id])

        return order;
    }catch(error){
        throw error;
    }
}

const getOrderByUser = async(userId) => {
    try{
        const {rows: order} = await client.query(`
            SELECT * 
            FROM orders
            WHERE "userId" = $1
        `, [userId])

        return order;
    }catch(error){
        throw error;
    }
}

const updateOrder = async({id, ...fields}) => {
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}" = $${index + 1}`
      ).join(', ');
    
      if (setString.length === 0) {
        return;
      }
      const valuesArray = [...Object.values(fields), id];
    
      try {
        const { rows: [updatedOrder] } = await client.query(`
          UPDATE orders
          SET ${setString}
          WHERE id = $${valuesArray.length}
          RETURNING *;
        `, valuesArray)
    
        return updatedOrder;
      } catch (error) {
        throw error;
      }
}

const deleteOrder = async(id) => {
    try{
        const {rows: [order]} = await client.query(`
            DELETE FROM orders
            WHERE id = $1
            RETURNING *;
        `, [id]);

        return order;

    }catch(error){
        throw error;
    }
}

module.exports ={ 
    createOrder,
    getAllOrders,
    getOrderbyId,
    getOrderByUser,
    updateOrder,
    deleteOrder

}