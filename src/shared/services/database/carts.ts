import {getFromDB, updateDB} from "./functions";
import {QUERIES} from "./queries";

export const getCart = async (userid) => {
    const { data, error } = await getFromDB(QUERIES.GET_CART, [userid])
    if (!error){
        const items = [];
        data.forEach(item => {
            items.push({
                product: {
                    id: item.product_id,
                    title: item.title,
                    description: item.description,
                    price: item.price
                },
                count: item.count
            });
        })
        return {id : data[0].cart_id, items}
    }

    return null;
}

export const updateCountInCart = async (cartId, productId, count) => {
    return await updateDB(QUERIES.UPDATE_COUNT_IN_CART, [cartId, productId, count])
}

export const updateCartStatus = async (cartId) => {
    await updateDB(QUERIES.UPDATE_CART_STATUS, [cartId])
}

export const addToCart = async (cartId, productId, count) => {
    return await updateDB(QUERIES.ADD_PRODUCT_TO_CART, [cartId, productId, count])
}

export const deleteFromCart = async (cartId, productId) => {
    return await updateDB(QUERIES.DELETE_PRODUCT_FROM_CART, [cartId, productId])
}

export const createCart = async (userId) => {
    const { data } = await getFromDB(QUERIES.CREATE_CART,[userId]);
    if(data.length) {
        return {id : data[0].id, items: []};
    }
    return null
}
