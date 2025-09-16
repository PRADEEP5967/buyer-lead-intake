'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme() as {
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    theme: 'light' | 'dark' | 'system' | undefined;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={cn(
            'cursor-pointer',
            theme === 'light' ? 'bg-accent font-medium' : '',
          )}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={cn(
            'cursor-pointer',
            theme === 'dark' ? 'bg-accent font-medium' : ''
          )}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={cn(
            'cursor-pointer',
            theme === 'system' ? 'bg-accent font-medium' : ''
          )}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter((c): c is string => typeof c === 'string').join(' ');
}
