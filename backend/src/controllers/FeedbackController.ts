import { Response, NextFunction } from 'express';
import FeedbackService from '../services/FeedbackService';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

class FeedbackController {
  async submit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const feedback = await FeedbackService.submit(req.user!.id, req.body.message);
      return ApiResponse.created(res, feedback, 'Feedback submitted');
    } catch (err) { next(err); }
  }
}

export default new FeedbackController();
