import { Response, NextFunction } from 'express';
import OrderService from '../services/OrderService';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import { OrderStatus } from '../models/Order.model';

class OrderController {
  async placeOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.placeOrder(req.user!.id, req.body.bookId, req.body.addressId);
      return ApiResponse.created(res, order, 'Order placed');
    } catch (err) { next(err); }
  }

  async getBuyerOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.getBuyerOrders(req.user!.id, req.query as Record<string, string>);
      return ApiResponse.success(res, result);
    } catch (err) { next(err); }
  }

  async getSellerOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.getSellerOrders(req.user!.id, req.query as Record<string, string>);
      return ApiResponse.success(res, result);
    } catch (err) { next(err); }
  }

  async getOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrder(req.params.id, req.user!.id);
      return ApiResponse.success(res, order);
    } catch (err) { next(err); }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.updateStatus(req.params.id, req.body.status as OrderStatus);
      return ApiResponse.success(res, order);
    } catch (err) { next(err); }
  }

  async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await OrderService.cancel(req.params.id, req.user!.id);
      return ApiResponse.success(res, null, 'Order cancelled');
    } catch (err) { next(err); }
  }
}

export default new OrderController();
