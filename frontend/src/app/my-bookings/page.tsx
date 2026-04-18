'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { bookingService, Booking } from '@/services/bookings';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await bookingService.cancelBooking(id);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading your bookings...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-600 mt-2">Manage your vehicle rentals here.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-lg border border-slate-200">
          You don't have any bookings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.ID} className="flex flex-col sm:flex-row justify-between items-center p-4">
              <div className="space-y-1 text-sm">
                <p><span className="font-semibold">Vehicle ID:</span> {booking.VehicleID}</p>
                <p><span className="font-semibold">Dates:</span> {booking.StartDate.split('T')[0]} to {booking.EndDate.split('T')[0]}</p>
                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  <span className={booking.Status === 'cancelled' ? 'text-red-500 font-bold' : 'text-green-600 font-bold capitalize'}>
                    {booking.Status}
                  </span>
                </p>
              </div>
              {booking.Status !== 'cancelled' && (
                <div className="mt-4 sm:mt-0">
                  <Button variant="danger" onClick={() => handleCancel(booking.ID)}>
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
