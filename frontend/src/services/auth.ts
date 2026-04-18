import api from './api';

export const authService = {
  login: async (data: any) => {
    const response = await api.post('/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/register', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
};
