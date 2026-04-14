import api from '../api/axios';

export const getAdminUsers       = ()          => api.get('/admin/users').then(r => r.data);
export const deleteAdminUser     = (id: string) => api.delete(`/admin/users/${id}`).then(r => r.data);
export const getAdminListings    = ()          => api.get('/admin/listings').then(r => r.data);
export const deleteAdminListing  = (id: string) => api.delete(`/admin/listings/${id}`).then(r => r.data);
export const getAdminTransactions= ()          => api.get('/admin/transactions').then(r => r.data);
export const getAdminFeedback    = ()          => api.get('/admin/feedback').then(r => r.data);
