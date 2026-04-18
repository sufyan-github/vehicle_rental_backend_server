'use client';

import { Vehicle } from '@/services/vehicles';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { bookingService } from '@/services/bookings';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface Props {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: Props) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [booking, setBooking] = useState(false);

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to book a vehicle');
      router.push('/login');
      return;
    }

    setBooking(true);
    try {
      // For simplicity, we just book for today and tomorrow. 
      // In a real app, we would open a date picker modal.
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      
      await bookingService.create({
        vehicle_id: vehicle.ID,
        start_date: today,
        end_date: tomorrow,
      });
      toast.success(`Successfully booked ${vehicle.Name}!`);
      router.push('/my-bookings');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to book vehicle');
    } finally {
      setBooking(false);
    }
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{vehicle.Name}</CardTitle>
          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${vehicle.Available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {vehicle.Available ? 'Available' : 'Booked'}
          </span>
        </div>
        <p className="text-sm text-slate-500">{vehicle.Brand}</p>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-blue-600">
          ${vehicle.PricePerDay} <span className="text-sm font-normal text-slate-500">/ day</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full gap-2" 
          disabled={!vehicle.Available || booking}
          onClick={handleBook}
        >
          <Calendar className="h-4 w-4" />
          {booking ? 'Processing...' : 'Book Now'}
        </Button>
      </CardFooter>
    </Card>
  );
}
