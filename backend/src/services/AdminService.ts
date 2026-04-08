import UserRepository from '../repositories/UserRepository';
import BookRepository from '../repositories/BookRepository';
import OrderRepository from '../repositories/OrderRepository';
import RentalRepository from '../repositories/RentalRepository';
import FeedbackService from './FeedbackService';
import AppError from '../utils/AppError';
import { paginate, paginatedResponse } from '../utils/pagination';

class AdminService {
  async getUsers(query: Record<string, string>) {
    const { page, limit, skip } = paginate(query);
    const data  = await UserRepository.findAll({}, skip, limit);
    const total = await UserRepository.count();
    return paginatedResponse(data, total, page, limit);
  }

  async deleteUser(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return UserRepository.delete(id);
  }

  async getListings(query: Record<string, string>) {
    const { page, limit, skip } = paginate(query);
    const { data, total } = await BookRepository.search({}, skip, limit);
    return paginatedResponse(data, total, page, limit);
  }

  async deleteListing(id: string) {
    const book = await BookRepository.findById(id);
    if (!book) throw new AppError('Book not found', 404);
    return BookRepository.delete(id);
  }

  async getTransactions(query: Record<string, string>) {
    const { page, limit, skip } = paginate(query);
    const [orders, rentals, totalOrders, totalRentals] = await Promise.all([
      OrderRepository.findAll({}, skip, limit),
      RentalRepository.findAll({}, skip, limit),
      OrderRepository.count(),
      RentalRepository.count(),
    ]);
    return { orders, rentals, totalOrders, totalRentals };
  }

  async getFeedback(query: Record<string, string>) {
    return FeedbackService.getAll(query);
  }
}

export default new AdminService();
