'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-slate-900">RentalDrive</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/vehicles" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Vehicles
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Dashboard
              </Link>
              <div className="hidden sm:block text-sm text-slate-500">
                {user?.email}
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
