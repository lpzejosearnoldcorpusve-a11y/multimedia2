'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BarChart3, Car, Route } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    label: 'Usuarios',
    href: '/dashboard/usuarios',
    icon: Users,
  },
  {
    label: 'Vehículos',
    href: '/dashboard/vehiculos',
    icon: Car,
  },
  {
    label: 'Rutas IA',
    href: '/dashboard/rutas',
    icon: Route,
  },
  {
    label: 'Reportes',
    href: '/dashboard/reportes',
    icon: BarChart3,
    disabled: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-sidebar">
      <nav className="space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent',
                item.disabled && 'pointer-events-none opacity-50'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
