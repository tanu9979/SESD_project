import RatingRepository from '../repositories/RatingRepository';
import OrderRepository from '../repositories/OrderRepository';
import UserRepository from '../repositories/UserRepository';
import AppError from '../utils/AppError';
import { paginate, paginatedResponse } from '../utils/pagination';

class RatingService {
  async rateOrder(reviewerId: string, data: { orderId: string; rating: number; comment?: string }) {
    const order = await OrderRepository.findById(data.orderId);
    if (!order) throw new AppError('Order not found', 404);
    if (order.buyer.toString() !== reviewerId) throw new AppError('Only buyer can rate', 403);
    if (!['delivered', 'completed'].includes(order.status)) throw new AppError('Can only rate after delivery', 400);

    const exists = await RatingRepository.existsForOrder(data.orderId, reviewerId);
    if (exists) throw new AppError('Already rated this order', 400);

    const book = await (order as any).populate('book');
    const sellerId = (order as any).book?.owner?.toString() ?? '';

    const rating = await RatingRepository.create({
      order: data.orderId as never,
      reviewer: reviewerId as never,
      seller: sellerId as never,
      rating: data.rating,
      comment: data.comment,
    });

    await UserRepository.updateAvgRating(sellerId);
    return rating;
  }

  async getSellerRatings(sellerId: string, query: Record<string, string>) {
    const { page, limit, skip } = paginate(query);
    const data  = await RatingRepository.findBySeller(sellerId, skip, limit);
    const total = await RatingRepository.count({ seller: sellerId });
    return paginatedResponse(data, total, page, limit);
  }
}

export default new RatingService();
