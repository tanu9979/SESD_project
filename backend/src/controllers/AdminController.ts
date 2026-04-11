import { Response, NextFunction } from 'express';
import AdminService from '../services/AdminService';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

class AdminController {
  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getUsers(req.query as Record<string, string>);
      return ApiResponse.success(res, result);
    } catch (err) { next(err); }
  }

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteUser(req.params.id);
      return ApiResponse.success(res, null, 'User deleted');
    } catch (err) { next(err); }
  }

  async getListings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getListings(req.query as Record<string, string>);
      return ApiResponse.success(res, result);
    } catch (err) { next(err); }
  }

  async deleteListing(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteListing(req.params.id);
      return ApiResponse.success(res, null, 'Listing deleted');
    } catch (err) { next(err); }
  }

  async getTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getTransactions(req.query as Record<string, string>);
      return ApiResponse.success(res, result);
    } catch (err) { next(err); }
  }

  async getFeedback(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getFeedback(req.query as Record<string, string>);
      return ApiResponse.success(res, result);
    } catch (err) { next(err); }
  }
}

export default new AdminController();
