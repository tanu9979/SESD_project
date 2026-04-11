import { Request, Response, NextFunction } from 'express';
import RatingService from '../services/RatingService';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

class RatingController {
  async rate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const rating = await RatingService.rateOrder(req.user!.id, req.body);
      return ApiResponse.created(res, rating, 'Rating submitted');
    } catch (err) { next(err); }
  }

  async getSellerRatings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RatingService.getSellerRatings(req.params.sellerId, req.query as Record<string, string>);
      return ApiResponse.success(res, result);
    } catch (err) { next(err); }
  }
}

export default new RatingController();
