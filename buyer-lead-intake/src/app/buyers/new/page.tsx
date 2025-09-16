import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BuyerFormClient } from '@/components/buyers/buyer-form-client';
import { Home, ArrowLeft } from 'lucide-react';

export default async function NewBuyerPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto max-w-6xl py-6 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center text-sm" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-muted-foreground mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <Link href="/buyers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Buyers
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-muted-foreground mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="text-sm font-medium text-foreground">New Buyer</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Add New Buyer</h1>
            <p className="text-muted-foreground">
              Create a new buyer's lead and start tracking their journey
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/buyers" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Buyers
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <BuyerFormClient />

        {/* Help Section */}
        <div className="rounded-lg border border-dashed p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Need help?</h3>
            <p className="text-sm text-muted-foreground">
              Learn how to effectively add and manage buyer leads in our documentation.
            </p>
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href="/help/buyer-management" target="_blank">
                View Documentation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
