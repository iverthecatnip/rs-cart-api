import { Injectable } from '@nestjs/common';

import { Order } from '../models';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateProductsCount, updateOrderStatus
} from "../../shared/services/database";

@Injectable()
export class OrderService {
  private orders: Record<string, Order> = {}

  async findOrders() {
    const orders = await getAllOrders();
    return orders;
  }

  async findOrderById(orderId) {
    const orders = await getOrderById(orderId);
    return orders;
  }

  async create(data: any) {
    const order = await createOrder(data);
    return order;
  }

  async delete(data: any) {
    const order = await deleteOrder(data);
    return order;
  }

  async update(orderId, data) {
    const order = await this.findOrderById(orderId);
    if (!order) {
      throw new Error('Order does not exist.');
    }

    await updateOrderStatus(orderId, data.status);


    if(data.status === 'APPROVED'){
      order.items.forEach(item => {
        updateProductsCount(item.productId,item.count)
      })

    }

    this.orders[ orderId ] = {
      ...data,
      id: orderId,
    }
  }
}
