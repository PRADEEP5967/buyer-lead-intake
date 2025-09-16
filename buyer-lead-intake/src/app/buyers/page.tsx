import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { BuyersTable } from '@/components/buyers/buyers-table';
import { BuyersTableSkeleton } from '@/components/buyers/buyers-table-skeleton';
import { AdvancedSearch } from '@/components/buyers/advanced-search';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function BuyersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Parse search params
  const search = (searchParams.search as string) || '';
  const status = (searchParams.status as string)?.split(',') || [];
  const city = (searchParams.city as string)?.split(',') || [];
  const propertyType = (searchParams.propertyType as string)?.split(',') || [];
  const dateFrom = searchParams.dateFrom as string || '';
  const dateTo = searchParams.dateTo as string || '';
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const pageSize = 10;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buyer Leads</h1>
          <p className="text-muted-foreground">
            Manage your buyer leads and track their status
          </p>
        </div>
        <Button asChild>
          <Link href="/buyers/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Buyer
          </Link>
        </Button>
      </div>

      <AdvancedSearch />

      <Suspense fallback={<BuyersTableSkeleton />}>
        <BuyersTable 
          search={search}
          status={status}
          city={city}
          propertyType={propertyType}
          dateFrom={dateFrom}
          dateTo={dateTo}
          page={page}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
}
