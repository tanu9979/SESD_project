import api from '../api/axios';

export const initiatePayment = (orderId: string, method: string) =>
  api.post('/payments/initiate', { orderId, method }).then(r => r.data);
export const confirmPayment  = (orderId: string) =>
  api.post('/payments/confirm', { orderId }).then(r => r.data);
