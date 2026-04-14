import api from '../api/axios';

export const startConversation  = (sellerId: string, bookId: string) =>
  api.post('/chat/start', { sellerId, bookId }).then(r => r.data);
export const getConversations   = () => api.get('/chat/conversations').then(r => r.data);
export const getMessages        = (id: string, params?: object) =>
  api.get(`/chat/${id}/messages`, { params }).then(r => r.data);
