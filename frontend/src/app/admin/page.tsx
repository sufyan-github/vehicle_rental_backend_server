'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { vehicleService, Vehicle } from '@/services/vehicles';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('0');
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    if (isAuthenticated) {
      fetchVehicles();
    }
  }, [isAuthenticated, user, router]);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getAll();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (v: Vehicle) => {
    setCurrentId(v.ID);
    setName(v.Name);
    setBrand(v.Brand);
    setPrice(v.PricePerDay.toString());
    setAvailable(v.Available);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setCurrentId(null);
    setName('');
    setBrand('');
    setPrice('');
    setAvailable(true);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await vehicleService.delete(id);
      toast.success('Vehicle deleted');
      fetchVehicles();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete vehicle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        brand,
        price_per_day: parseFloat(price),
        available,
      };

      if (currentId) {
        await vehicleService.update(currentId, payload);
        toast.success('Vehicle updated');
      } else {
        await vehicleService.create(payload);
        toast.success('Vehicle added');
      }
      setShowForm(false);
      fetchVehicles();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save vehicle');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-slate-600 mt-2">Manage all vehicles in the platform.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 border-blue-200 shadow-md">
          <CardHeader>
            <CardTitle>{currentId ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Toyota Camry" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand</label>
                  <Input value={brand} onChange={(e) => setBrand(e.target.value)} required placeholder="e.g. Toyota" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Per Day ($)</label>
                  <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="space-y-2 flex items-center mt-8 gap-2">
                  <input 
                    type="checkbox" 
                    id="available"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300"
                  />
                  <label htmlFor="available" className="text-sm font-medium">Available for rent</label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div>Loading vehicles...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {vehicles.map(v => (
            <div key={v.ID} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
              <div>
                <h3 className="font-semibold text-lg">{v.Name} <span className="text-sm text-slate-500 font-normal ml-2">{v.Brand}</span></h3>
                <p className="text-sm text-slate-600">${v.PricePerDay} / day • {v.Available ? <span className="text-green-600">Available</span> : <span className="text-red-500">Booked</span>}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(v)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(v.ID)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
