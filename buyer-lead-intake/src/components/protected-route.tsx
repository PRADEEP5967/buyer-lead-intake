'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    // If user is not authenticated, redirect to sign-in
    if (!session) {
      const callbackUrl = encodeURIComponent(pathname);
      router.push(`/auth/signin?callbackUrl=${callbackUrl}`);
      return;
    }

    // If role is required and user doesn't have it, redirect to unauthorized
    if (requiredRole && session.user.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [session, status, router, pathname, requiredRole]);

  // Show loading state while checking authentication
  if (status === 'loading' || !session) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check if user has required role
  if (requiredRole && session.user.role !== requiredRole) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
