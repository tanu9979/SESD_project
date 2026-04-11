import { Response, NextFunction } from 'express';
import BookService from '../services/BookService';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

class BookController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await BookService.getAll(req.query as Record<string, string>);
      return ApiResponse.success(res, result);
    } catch (err) { next(err); }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const book = await BookService.getById(req.params.id);
      return ApiResponse.success(res, book);
    } catch (err) { next(err); }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const book = await BookService.create(req.user!.id, req.body);
      return ApiResponse.created(res, book);
    } catch (err) { next(err); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const book = await BookService.update(req.params.id, req.user!.id, req.body);
      return ApiResponse.success(res, book);
    } catch (err) { next(err); }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await BookService.remove(req.params.id, req.user!.id);
      return ApiResponse.success(res, null, 'Book deleted');
    } catch (err) { next(err); }
  }

  async getMyListings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await BookService.getMyListings(req.user!.id, req.query as Record<string, string>);
      return ApiResponse.success(res, result);
    } catch (err) { next(err); }
  }
}

export default new BookController();
