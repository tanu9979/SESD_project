import api from '../api/axios';

export const register = (data: object) => api.post('/auth/register', data).then(r => r.data);
export const login    = (data: object) => api.post('/auth/login', data).then(r => r.data);
