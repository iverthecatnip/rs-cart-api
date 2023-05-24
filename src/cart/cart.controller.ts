import { Controller, Get, Delete, Put, Body, Req, Post, UseGuards, HttpStatus } from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderService } from '../order';
import {AppRequest, getOrderIdFromRequest, getUserIdFromRequest} from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import {createUser} from "../shared/services/database";

@Controller('dev/api')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get('/profile/cart/:userid')
  async findUserCart(@Req() req: AppRequest) {
    let user = getUserIdFromRequest(req);
    if(user === 'null'){
      user = await createUser();
    }

    const cart = await this.cartService.findByUserId(user);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, user, total: calculateCartTotal(cart) },
    }
  }

  @Get('/orders/:orderId?')
  async findOrders(@Req() req: AppRequest) {
    const orderId = getOrderIdFromRequest(req);
    let orders;
    if(!orderId){
      orders = await this.orderService.findOrders();
    }else{
      orders = await this.orderService.findOrderById(orderId);
     }

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { orders },
    }
  }

  @Delete('/orders/:orderId?')
  async deleteOrder(@Req() req: AppRequest) {
    const orderId = getOrderIdFromRequest(req);
    await this.orderService.delete(orderId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  @Put('/orders/:orderId?')
  async updateOrder(@Req() req: AppRequest, @Body() body) {
    const orderId = getOrderIdFromRequest(req);
    await this.orderService.update(orderId, body);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put('/profile/cart/:userid')
  async updateUserCart(@Req() req: AppRequest, @Body() body) { // TODO: validate body payload...
    const resp = await this.cartService.updateByUserId(getUserIdFromRequest(req), body)

    return {
      statusCode: HttpStatus.OK,
      message: resp,
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Delete('/profile/cart/:userid')
  clearUserCart(@Req() req: AppRequest) {
    this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Post('/checkout/:userid')
  async checkout(@Req() req: AppRequest, @Body() body) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(cart);

    const order = await this.orderService.create({
      ...body, // TODO: validate and pick only necessary data
      userId,
      cartId,
      items,
      total,
    });


    await this.cartService.updateCartStatus(cartId)

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
