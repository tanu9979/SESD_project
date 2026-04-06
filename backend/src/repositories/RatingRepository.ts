import BaseRepository from './BaseRepository';
import RatingModel, { IRating } from '../models/Rating.model';

class RatingRepository extends BaseRepository<IRating> {
  constructor() { super(RatingModel); }

  async findBySeller(sellerId: string, skip: number, limit: number) {
    return this.model.find({ seller: sellerId }).populate('reviewer', 'name').skip(skip).limit(limit).sort({ createdAt: -1 });
  }

  async existsForOrder(orderId: string, reviewerId: string) {
    return this.model.exists({ order: orderId, reviewer: reviewerId });
  }
}

export default new RatingRepository();
