import { Server } from 'socket.io';
import ChatService from '../services/ChatService';

export const initSocket = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(conversationId);
    });

    socket.on('send_message', async ({ conversationId, senderId, content }: {
      conversationId: string;
      senderId: string;
      content: string;
    }) => {
      try {
        const message = await ChatService.sendMessage(conversationId, senderId, content);
        io.to(conversationId).emit('receive_message', message);
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('message_read', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      socket.to(conversationId).emit('messages_read', { conversationId, userId });
    });

    socket.on('disconnect', () => {});
  });
};
