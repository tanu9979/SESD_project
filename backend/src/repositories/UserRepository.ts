import BaseRepository from './BaseRepository';
import UserModel, { IUser } from '../models/User.model';
import RatingModel from '../models/Rating.model';

class UserRepository extends BaseRepository<IUser> {
  constructor() { super(UserModel); }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }

  async updateAvgRating(sellerId: string): Promise<void> {
    const result = await RatingModel.aggregate([
      { $match: { seller: sellerId } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    const avg = result[0]?.avg ?? 0;
    await this.model.findByIdAndUpdate(sellerId, { avgRating: parseFloat(avg.toFixed(2)) });
  }
}

export default new UserRepository();
