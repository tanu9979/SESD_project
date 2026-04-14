import api from '../api/axios';

export const getBooks       = (params?: object) => api.get('/books', { params }).then(r => r.data);
export const getBook        = (id: string)       => api.get(`/books/${id}`).then(r => r.data);
export const getMyListings  = (params?: object)  => api.get('/books/my', { params }).then(r => r.data);
export const createBook     = (data: object)     => api.post('/books', data).then(r => r.data);
export const updateBook     = (id: string, data: object) => api.put(`/books/${id}`, data).then(r => r.data);
export const deleteBook     = (id: string)       => api.delete(`/books/${id}`).then(r => r.data);
export const getExamTags    = ()                 => api.get('/exam-tags').then(r => r.data);
