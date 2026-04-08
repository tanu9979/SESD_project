import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository';
import AppError from '../utils/AppError';
import env from '../config/env';

class AuthService {
  async register(data: { name: string; email: string; password: string; countryCode?: string; currencyCode?: string }) {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw new AppError('Email already registered', 409);

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await UserRepository.create({ ...data, password: hashed });
    const token = this.generateToken(user);
    return { user: this.sanitize(user), token };
  }

  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError('Invalid credentials', 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError('Invalid credentials', 401);

    const token = this.generateToken(user);
    return { user: this.sanitize(user), token };
  }

  private generateToken(user: { _id: unknown; role: string; email: string }) {
    return jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sanitize(user: any) {
    const obj: Record<string, unknown> = typeof user.toObject === 'function' ? user.toObject() : { ...user };
    const { password: _, ...safe } = obj;
    return safe;
  }
}

export default new AuthService();
