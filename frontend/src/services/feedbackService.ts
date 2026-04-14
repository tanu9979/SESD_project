import api from '../api/axios';

export const submitFeedback = (data: object) => api.post('/feedback', data).then(r => r.data);
