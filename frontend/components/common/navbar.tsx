'use client';

import Link from 'next/link';
import { Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout-button';
import { useAuth } from '@/context/auth-context';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">TransportApp</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
