import { Skeleton } from '@/components/ui/skeleton';

interface BuyersTableSkeletonProps {
  search: string;
  status: string;
  city: string;
  propertyType: string;
  page: number;
  pageSize: number;
}

export function BuyersTableSkeleton({
  pageSize = 10,
}: BuyersTableSkeletonProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full
          [&_th]:h-12 [&_th]:px-4 [&_th]:text-left [&_th]:align-middle [&_th]:font-medium [&_th]:text-muted-foreground
          [&_td]:p-4 [&_td]:align-middle [&_tr]:border-t [&_tr]:border-border
        ">
          <thead>
            <tr>
              <th className="w-[300px]">Name</th>
              <th>Contact</th>
              <th>Property</th>
              <th>Budget</th>
              <th>Status</th>
              <th className="text-right">Last Updated</th>
              <th className="w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: pageSize }).map((_, i) => (
              <tr key={i}>
                <td className="w-[300px]">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </td>
                <td>
                  <Skeleton className="h-4 w-20" />
                </td>
                <td>
                  <Skeleton className="h-4 w-24" />
                </td>
                <td>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="text-right">
                  <Skeleton className="ml-auto h-4 w-20" />
                </td>
                <td>
                  <div className="flex justify-end space-x-1">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between border-t px-4 py-3">
        <Skeleton className="h-4 w-48" />
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}
