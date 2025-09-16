'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, FileText, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: 'Buyers',
    href: '/buyers',
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span>Buyer Leads</span>
          </Link>
        </div>
        
        <div className="p-2">
          <Button asChild className="w-full justify-start gap-2">
            <Link href="/buyers/new">
              <Plus className="h-4 w-4" />
              Add New Buyer
            </Link>
          </Button>
        </div>
        
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  (pathname === item.href || pathname.startsWith(`${item.href}/`)) && 'bg-muted text-primary'
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
