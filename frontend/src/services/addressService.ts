import api from '../api/axios';

export const getAddresses   = ()              => api.get('/addresses').then(r => r.data);
export const addAddress     = (data: object)  => api.post('/addresses', data).then(r => r.data);
export const setDefault     = (id: string)    => api.patch(`/addresses/${id}/default`).then(r => r.data);
export const deleteAddress  = (id: string)    => api.delete(`/addresses/${id}`).then(r => r.data);
export const estimateDelivery = (sellerPincode: string, buyerPincode: string) =>
  api.get('/delivery/estimate', { params: { sellerPincode, buyerPincode } }).then(r => r.data);
