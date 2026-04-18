'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Car, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/my-bookings', label: 'My Bookings', icon: CalendarDays },
  ];

  if (user?.role === 'admin') {
    links.push({ href: '/admin', label: 'Admin Panel', icon: Settings });
  }

  return (
    <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)]">
      <nav className="flex flex-col space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
