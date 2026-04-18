import api from './api';

export interface Vehicle {
  ID: number;
  Name: string;
  Brand: string;
  PricePerDay: number;
  Available: boolean;
}

export const vehicleService = {
  getAll: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/admin/vehicle', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/vehicle/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/admin/vehicle/${id}`);
    return response.data;
  },
};
