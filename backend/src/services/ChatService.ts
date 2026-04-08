import ChatRepository from '../repositories/ChatRepository';
import AppError from '../utils/AppError';
import { paginate } from '../utils/pagination';

class ChatService {
  async startConversation(buyerId: string, sellerId: string, bookId: string) {
    if (buyerId === sellerId) throw new AppError('Cannot chat with yourself', 400);
    return ChatRepository.findOrCreate(buyerId, sellerId, bookId);
  }

  async getConversations(userId: string) {
    return ChatRepository.getUserConversations(userId);
  }

  async getMessages(conversationId: string, userId: string, query: Record<string, string>) {
    const convo = await ChatRepository.findById(conversationId);
    if (!convo) throw new AppError('Conversation not found', 404);

    const isParticipant = [convo.buyer.toString(), convo.seller.toString()].includes(userId);
    if (!isParticipant) throw new AppError('Forbidden', 403);

    const { skip, limit } = paginate(query);
    await ChatRepository.markRead(conversationId, userId);
    return ChatRepository.getMessages(conversationId, skip, limit);
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const convo = await ChatRepository.findById(conversationId);
    if (!convo) throw new AppError('Conversation not found', 404);

    const isParticipant = [convo.buyer.toString(), convo.seller.toString()].includes(senderId);
    if (!isParticipant) throw new AppError('Forbidden', 403);

    return ChatRepository.createMessage(conversationId, senderId, content);
  }
}

export default new ChatService();
