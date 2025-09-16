import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500">403</h1>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Unauthorized Access
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to access this page.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
