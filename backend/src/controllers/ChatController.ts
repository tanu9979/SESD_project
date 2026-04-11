import { Response, NextFunction } from 'express';
import ChatService from '../services/ChatService';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

class ChatController {
  async startConversation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const convo = await ChatService.startConversation(req.user!.id, req.body.sellerId, req.body.bookId);
      return ApiResponse.success(res, convo);
    } catch (err) { next(err); }
  }

  async getConversations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const convos = await ChatService.getConversations(req.user!.id);
      return ApiResponse.success(res, convos);
    } catch (err) { next(err); }
  }

  async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const messages = await ChatService.getMessages(req.params.id, req.user!.id, req.query as Record<string, string>);
      return ApiResponse.success(res, messages);
    } catch (err) { next(err); }
  }
}

export default new ChatController();
