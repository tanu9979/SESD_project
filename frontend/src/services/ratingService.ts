import api from '../api/axios';

export const submitRating    = (data: object)  => api.post('/ratings', data).then(r => r.data);
export const getSellerRatings= (sellerId: string, params?: object) =>
  api.get(`/ratings/seller/${sellerId}`, { params }).then(r => r.data);
