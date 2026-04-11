import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import ApiResponse from '../utils/ApiResponse';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return ApiResponse.created(res, result, 'Registered successfully');
    } catch (err) { next(err); }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body.email, req.body.password);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (err) { next(err); }
  }
}

export default new AuthController();
