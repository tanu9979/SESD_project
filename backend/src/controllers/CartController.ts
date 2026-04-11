import { Response, NextFunction } from 'express';
import CartService from '../services/CartService';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

class CartController {
  async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.getCart(req.user!.id);
      return ApiResponse.success(res, cart);
    } catch (err) { next(err); }
  }

  async addToCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const item = await CartService.addToCart(req.user!.id, req.body.bookId);
      return ApiResponse.created(res, item, 'Added to cart');
    } catch (err) { next(err); }
  }

  async removeFromCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await CartService.removeFromCart(req.params.id, req.user!.id);
      return ApiResponse.success(res, null, 'Removed from cart');
    } catch (err) { next(err); }
  }
}

export default new CartController();
