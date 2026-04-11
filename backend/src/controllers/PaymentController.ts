import { Response, NextFunction } from 'express';
import PaymentService from '../services/PaymentService';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

class PaymentController {
  async initiate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await PaymentService.initiatePayment(req.body.orderId, req.body.method);
      return ApiResponse.success(res, result);
    } catch (err) { next(err); }
  }

  async confirm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const txId = `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const result = await PaymentService.confirmPayment(req.body.orderId, txId);
      return ApiResponse.success(res, result, 'Payment confirmed');
    } catch (err) { next(err); }
  }
}

export default new PaymentController();
