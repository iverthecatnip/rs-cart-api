import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  return request.params.userid;
}

export function getOrderIdFromRequest(request: AppRequest): string {
  return request.params.orderId;
}
