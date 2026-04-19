import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const appErr = err instanceof AppError ? err : new AppError('Internal server error', 500);
  console.error(`[${new Date().toISOString()}] ${err.message}`, err.stack);
  return res.status(appErr.statusCode).json({ success: false, message: appErr.message });
};

export default errorHandler;
