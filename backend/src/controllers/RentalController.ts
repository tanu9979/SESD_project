import { Response, NextFunction } from 'express';
import RentalService from '../services/RentalService';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

class RentalController {
  async rent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const rental = await RentalService.rentBook(req.user!.id, req.body);
      return ApiResponse.created(res, rental, 'Rental created');
    } catch (err) { next(err); }
  }

  async getMyRentals(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await RentalService.getMyRentals(req.user!.id, req.query as Record<string, string>);
      return ApiResponse.success(res, result);
    } catch (err) { next(err); }
  }

  async returnBook(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const rental = await RentalService.returnBook(req.params.id, req.user!.id);
      return ApiResponse.success(res, rental, 'Book returned');
    } catch (err) { next(err); }
  }
}

export default new RentalController();
