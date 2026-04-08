import FeedbackRepository from '../repositories/FeedbackRepository';
import { paginate, paginatedResponse } from '../utils/pagination';

class FeedbackService {
  async submit(userId: string, message: string) {
    return FeedbackRepository.create({ user: userId as never, message });
  }

  async getAll(query: Record<string, string>) {
    const { page, limit, skip } = paginate(query);
    const data  = await FeedbackRepository.findAllWithUser(skip, limit);
    const total = await FeedbackRepository.count();
    return paginatedResponse(data, total, page, limit);
  }
}

export default new FeedbackService();
