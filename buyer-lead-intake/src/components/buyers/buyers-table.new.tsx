'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import dynamic from 'next/dynamic';
import { Eye, Pencil, Phone, Mail, Home, Plus, AlertCircle, Building, Calendar } from 'lucide-react';

// Dynamically import heavy components
const BuyersTableSkeleton = dynamic(() => import('./buyers-table-skeleton'), { 
  loading: () => <div>Loading...</div>,
  ssr: false 
});

import { getInitials, getStatusColor, getPropertyTypeIcon, formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import type { Buyer, BuyersTableProps, BuyersResponse } from '@/types/buyer';

// Error boundary component for the table
export function TableErrorBoundary({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="mt-3 text-lg font-medium text-red-800">Something went wrong</h3>
      <p className="mt-2 text-red-600">{error.message || 'Failed to load buyer data'}</p>
      <div className="mt-6">
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function BuyersTable({
  search,
  status = [],
  city = [],
  propertyType = [],
  dateFrom = '',
  dateTo = '',
  page = 1,
  pageSize = 10,
}: BuyersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Debounce search to avoid too many requests
  const debouncedSearch = useDebounce(search, 300);
  
  // Memoize filters to prevent unnecessary effect triggers
  const filters = useMemo(() => {
    const filterObj: Record<string, any> = {
      query: debouncedSearch || undefined,
      page,
      limit: pageSize,
    };

    if (status?.length) filterObj.status = status;
    if (city?.length) filterObj.city = city;
    if (propertyType?.length) filterObj.propertyType = propertyType;
    if (dateFrom) filterObj.dateFrom = dateFrom;
    if (dateTo) filterObj.dateTo = dateTo;

    return filterObj;
  }, [debouncedSearch, status, city, propertyType, dateFrom, dateTo, page, pageSize]);

  const fetchBuyers = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/buyers/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
        signal: signal || controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to fetch buyers');
      }
      
      const data: BuyersResponse = await response.json();
      setBuyers(data.buyers);
      setTotal(data.total);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching buyers:', err);
        setError(err instanceof Error ? err : new Error('An error occurred'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    
    // Only fetch if we have a valid page number
    if (page > 0) {
      fetchBuyers(controller.signal);
    }
    
    return () => {
      controller.abort();
    };
  }, [fetchBuyers, page, JSON.stringify(filters)]);

  const handleView = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    router.push(`/buyers/${id}`, { scroll: false });
  }, [router]);

  const handleEdit = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/buyers/${id}/edit`, { scroll: false });
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleView(id, e as any);
    }
  }, [handleView]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const handlePageChange = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);
  
  const handleRetry = useCallback(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  // Show error state
  if (error) {
    return <TableErrorBoundary error={error} onRetry={handleRetry} />;
  }

  // Show empty state
  if (buyers.length === 0 && !isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-dashed">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-lg font-medium">No buyers found</h3>
          <p className="text-sm text-muted-foreground">
            {search || status.length > 0 || city.length > 0 || propertyType.length > 0 || dateFrom || dateTo
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding a new buyer.'}
          </p>
          <Button className="mt-4" asChild>
            <Link href="/buyers/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Buyer
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              buyers.map((buyer) => (
                <TableRow 
                  key={buyer.id}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onClick={() => handleView(buyer.id)}
                  onKeyDown={(e) => handleKeyDown(e, buyer.id)}
                  aria-label={`View details for ${buyer.fullName}`}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={buyer.image} alt={buyer.fullName} />
                        <AvatarFallback>
                          {getInitials(buyer.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{buyer.fullName}</div>
                        <div className="text-xs text-muted-foreground">
                          {buyer.source}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{buyer.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{buyer.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPropertyTypeIcon(buyer.propertyType)}
                      <div>
                        <div className="font-medium">{buyer.propertyType}</div>
                        <div className="text-sm text-muted-foreground">
                          {buyer.city} • {buyer.bhk}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {buyer.budgetMin ? formatCurrency(buyer.budgetMin) : 'N/A'}
                      {buyer.budgetMax && ` - ${formatCurrency(buyer.budgetMax)}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {buyer.purpose}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(buyer.status)}>
                      {buyer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(new Date(buyer.updatedAt), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        itemsPerPage={pageSize}
        className="mt-4"
        onPageChange={handlePageChange}
      />
    </div>
  );
}
