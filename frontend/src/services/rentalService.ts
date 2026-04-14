import api from '../api/axios';

export const rentBook       = (data: object)  => api.post('/rentals', data).then(r => r.data);
export const getMyRentals   = (params?: object)=> api.get('/rentals/my', { params }).then(r => r.data);
export const returnBook     = (id: string)     => api.patch(`/rentals/${id}/return`).then(r => r.data);
