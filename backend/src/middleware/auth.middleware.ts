import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import AppError from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export const verifyToken = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(new AppError('No token provided', 401));

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthRequest['user'];
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const requireRole = (role: string) => (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (req.user?.role !== role) return next(new AppError('Forbidden', 403));
  next();
};
