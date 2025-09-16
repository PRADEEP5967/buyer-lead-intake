'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, Plus } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Buyers', href: '/buyers' },
  { name: 'New Buyers', href: '/buyers/new' },
  { name: 'Reports', href: '/reports' },
  { name: 'Settings', href: '/settings' },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:static sm:px-6">
      {/* Mobile menu button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold mb-6"
            >
              <span>Buyer Leads</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all',
                  'hover:text-foreground',
                  pathname === item.href && 'bg-muted text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors',
              'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              pathname === item.href && 'bg-accent text-accent-foreground'
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search buyers..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        
        <Button asChild size="sm" className="ml-2 hidden sm:flex">
          <Link href="/buyers/new" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New Buyer</span>
          </Link>
        </Button>
        
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
