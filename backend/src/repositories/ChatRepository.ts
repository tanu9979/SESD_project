import BaseRepository from './BaseRepository';
import ConversationModel, { IConversation } from '../models/Conversation.model';
import MessageModel, { IMessage } from '../models/Message.model';

class ChatRepository extends BaseRepository<IConversation> {
  constructor() { super(ConversationModel); }

  async findOrCreate(buyerId: string, sellerId: string, bookId: string): Promise<IConversation> {
    const existing = await ConversationModel.findOne({ buyer: buyerId, seller: sellerId, book: bookId });
    if (existing) return existing;
    return ConversationModel.create({ buyer: buyerId, seller: sellerId, book: bookId });
  }

  async getUserConversations(userId: string) {
    return ConversationModel.find({ $or: [{ buyer: userId }, { seller: userId }] })
      .populate('buyer seller', 'name').populate('book', 'title').sort({ updatedAt: -1 });
  }

  async getMessages(conversationId: string, skip: number, limit: number): Promise<IMessage[]> {
    return MessageModel.find({ conversation: conversationId }).populate('sender', 'name').skip(skip).limit(limit).sort({ sentAt: 1 });
  }

  async createMessage(conversationId: string, senderId: string, content: string): Promise<IMessage> {
    return MessageModel.create({ conversation: conversationId, sender: senderId, content });
  }

  async markRead(conversationId: string, userId: string) {
    return MessageModel.updateMany({ conversation: conversationId, sender: { $ne: userId }, isRead: false }, { isRead: true });
  }
}

export default new ChatRepository();
