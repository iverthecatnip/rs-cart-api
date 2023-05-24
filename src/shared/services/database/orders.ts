import {getFromDB, updateDB} from "./functions";
import {QUERIES} from "./queries";

export const getAllOrders = async () => {
    const { data, error } = await getFromDB(QUERIES.GET_ALL_ORDERS)
    if (!error) {

        return data;
    }

    return null;
}

export const getOrderById = async (orderId) => {
    const { data, error } = await getFromDB(QUERIES.GET_ORDER_BY_ID, [orderId])
    if (!error) {
        const items = [];
        data.forEach(item => {
            items.push({
                productId: item.product_id,
                title: item.title,
                description: item.description,
                price: item.price,
                count: item.count
            });
        });
        return {
            cart_id: data[0].cart_id,
            comments: data[0].comments,
            delivery: data[0].delivery,
            status: data[0].status,
            total: data[0].total,
            user_id: data[0].user_id,
            id: data[0].id,
            items
        }
    }

    return null;
}

export const createOrder = async ({userId, cartId, address, total}) => {
    const { data } = await getFromDB(QUERIES.CREATE_ORDER, [userId, cartId, address, total]);
    if(data.length) {
        return data[0].id;
    }
    return null
}


export const deleteOrder = async (orderId) => {
    return await updateDB(QUERIES.DELETE_ORDER, [orderId])
}

export const updateOrderStatus = async (orderId, status) => {
    return await updateDB(QUERIES.UPDATE_ORDER_STATUS, [orderId, status])
}

export const updateProductsCount = async (productId, count) => {
    return await updateDB(QUERIES.UPDATE_PRODUCTS_COUNT, [productId, count])
}
