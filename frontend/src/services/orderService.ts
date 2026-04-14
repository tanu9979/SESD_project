import api from '../api/axios';

export const placeOrder      = (data: object)  => api.post('/orders', data).then(r => r.data);
export const getMyOrders     = (params?: object)=> api.get('/orders/my', { params }).then(r => r.data);
export const getSellerOrders = (params?: object)=> api.get('/orders/selling', { params }).then(r => r.data);
export const getOrder        = (id: string)     => api.get(`/orders/${id}`).then(r => r.data);
export const updateStatus    = (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }).then(r => r.data);
export const cancelOrder     = (id: string)     => api.patch(`/orders/${id}/cancel`).then(r => r.data);
