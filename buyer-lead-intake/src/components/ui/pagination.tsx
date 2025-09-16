import { Button } from './button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className = '',
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Ensure we have valid values before rendering
  if (isNaN(totalPages) || totalPages <= 1) return null;

  // Ensure all values are valid numbers
  const safeCurrentPage = Math.max(1, Number(currentPage) || 1);
  const safeItemsPerPage = Math.max(1, Number(itemsPerPage) || 10);
  const safeTotalItems = Math.max(0, Number(totalItems) || 0);
  
  const startItem = Math.min((safeCurrentPage - 1) * safeItemsPerPage + 1, safeTotalItems);
  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> result{totalItems !== 1 ? 's' : ''}
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={safeCurrentPage <= 1}
          className="h-8 w-8 p-0"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? 'default' : 'outline'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </Button>
          );
        })}
        
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <span className="px-2 text-sm text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        )}
        
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(totalPages)}
            aria-label={`Page ${totalPages}`}
          >
            {totalPages}
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
          className="h-8 w-8 p-0"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
