'use client';

import { useEffect, useState } from 'react';
import { vehicleService, Vehicle } from '@/services/vehicles';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { toast } from 'react-toastify';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getAll();
      // Ensure data is an array
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-xl font-medium text-slate-600 animate-pulse">Loading vehicles...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Available Vehicles</h1>
        <p className="text-slate-600 mt-2">Find the perfect vehicle for your next adventure.</p>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-lg border border-slate-200">
          No vehicles available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.ID} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
