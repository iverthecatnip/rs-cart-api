export const QUERIES = {
    GET_CART: `SELECT carts.id as cart_id, cart_items.product_id, cart_items.count, products.title, products.description, products.price 
            FROM carts 
            JOIN cart_items ON carts.id = cart_items.cart_id 
            JOIN products ON cart_items.product_id = products.id 
            WHERE user_id = $1 AND status = 'OPEN'`,
    CREATE_CART: `INSERT INTO carts (user_id, status) VALUES ($1, 'OPEN') RETURNING id`,
    ADD_PRODUCT_TO_CART: `INSERT INTO cart_items (cart_id, product_id, count) VALUES ($1, $2, $3)`,
    UPDATE_CART_STATUS: `UPDATE carts SET status = 'ORDERED' where id = $1`,
    UPDATE_COUNT_IN_CART: `UPDATE cart_items SET count = $3 WHERE (product_id = $2 and cart_id = $1)`,
    DELETE_PRODUCT_FROM_CART: `DELETE FROM cart_items WHERE (product_id = $2 and cart_id = $1)`,
    GET_ALL_ORDERS: `SELECT * FROM orders`,
    GET_ORDER_BY_ID: `SELECT orders.id, orders.user_id, orders.cart_id, delivery, comments, status, total, cart_items.count, products.id as product_id, products.title, products.description, products.price 
            FROM orders 
            JOIN cart_items ON orders.cart_id = cart_items.cart_id 
            JOIN products ON cart_items.product_id = products.id 
            WHERE orders.id = $1`,
    CREATE_ORDER: `INSERT INTO orders (user_id, cart_id, delivery, status, total) VALUES ($1, $2, $3, 'OPEN', $4) RETURNING id`,
    DELETE_ORDER: `DELETE FROM orders WHERE id = $1`,
    CREATE_USER: `INSERT INTO users (email, name, login, password) VALUES ('default', 'default', 'default', 'default') RETURNING id`,
    UPDATE_ORDER_STATUS: 'UPDATE orders SET status = $2 where id = $1',
    UPDATE_PRODUCTS_COUNT: 'UPDATE stocks SET count = count - $2 where product_id = $1'
}
