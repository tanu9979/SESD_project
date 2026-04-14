import api from '../api/axios';

export const getCart        = ()              => api.get('/cart').then(r => r.data);
export const addToCart      = (bookId: string)=> api.post('/cart', { bookId }).then(r => r.data);
export const removeFromCart = (id: string)    => api.delete(`/cart/${id}`).then(r => r.data);
