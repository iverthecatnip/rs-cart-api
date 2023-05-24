import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import {Cart, CartItem} from '../models';
import {use} from "passport";
import {
  addToCart,
  createCart,
  deleteFromCart,
  getCart,
  updateCartStatus,
  updateCountInCart
} from "../../shared/services/database";

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<Cart> {
    const cart = await getCart(userId);
    return cart
  }

  async createByUserId(userId: string) {
    const cart = await createCart(userId);
    return cart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);
    if (userCart) {
      return userCart;
    }

    const newCart = await this.createByUserId(userId)
    return newCart;
  }

  async updateByUserId(userId: string,  item : CartItem): Promise<string> {
    const { id, items } = await this.findOrCreateByUserId(userId);
    const addedAlready = items.find(productItem => productItem.product.id === item.product.id);
    let updated:{ error: string }
    if(addedAlready){
      if(item.count > 0){
        updated = await updateCountInCart(id, item.product.id, item.count)
      }else{
        updated = await deleteFromCart(id, item.product.id)
      }
    }else{
      updated = await addToCart(id, item.product.id, item.count)
    }
    return updated.error;
  }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }

  updateCartStatus(cartId): void {
     updateCartStatus(cartId)
  }

}
