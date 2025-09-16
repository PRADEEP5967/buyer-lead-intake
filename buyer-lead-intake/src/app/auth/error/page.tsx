'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The sign in link is no longer valid.',
    Default: 'An error occurred while signing in.',
  };

  const errorMessage = error ? errorMessages[error as keyof typeof errorMessages] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white dark:bg-gray-800 p-8 shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Sign In Error
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Button className="w-full" asChild>
            <Link href="/auth/signin">
              Back to Sign In
            </Link>
          </Button>
          
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
