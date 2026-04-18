import api from './api';

export interface Booking {
  ID: number;
  UserID: number;
  VehicleID: number;
  StartDate: string;
  EndDate: string;
  Status: string;
}

export const bookingService = {
  create: async (data: { vehicle_id: number; start_date: string; end_date: string }) => {
    const response = await api.post('/book', data);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await api.get('/my-bookings');
    return response.data;
  },
  cancelBooking: async (id: number) => {
    const response = await api.put(`/cancel-booking/${id}`);
    return response.data;
  },
};
