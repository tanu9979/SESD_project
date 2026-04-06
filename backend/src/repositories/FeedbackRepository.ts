import BaseRepository from './BaseRepository';
import FeedbackModel, { IFeedback } from '../models/Feedback.model';

class FeedbackRepository extends BaseRepository<IFeedback> {
  constructor() { super(FeedbackModel); }

  async findAllWithUser(skip: number, limit: number) {
    return this.model.find().populate('user', 'name email').skip(skip).limit(limit).sort({ createdAt: -1 });
  }
}

export default new FeedbackRepository();
