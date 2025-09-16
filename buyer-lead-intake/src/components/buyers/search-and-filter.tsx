'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

interface SearchAndFilterProps {
  search: string;
  status: string;
  city: string;
  propertyType: string;
}

export function SearchAndFilter({ search, status, city, propertyType }: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('search', term);
      params.set('page', '1'); // Reset to first page on new search
    } else {
      params.delete('search');
    }
    router.push(`/buyers?${params.toString()}`);
  }, 300);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
      params.set('page', '1'); // Reset to first page on new filter
    } else {

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      status: [],
      city: [],
      propertyType: [],
      budgetMin: 0,
      budgetMax: 10000000,
      dateRange: { from: undefined, to: undefined },
    });
    onSearch({});
  };

  const hasActiveFilters = 
    filters.query || 
    filters.status.length > 0 || 
    filters.city.length > 0 || 
    filters.propertyType.length > 0 ||
    filters.budgetMin > 0 ||
    filters.budgetMax < 10000000 ||
    filters.dateRange.from ||
    filters.dateRange.to;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, phone, or notes..."
            className="w-full pl-8"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
        </div>
        <Button type="submit" variant="default">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-8 px-2 text-xs"
                  >
                    Reset
                  </Button>
                )}
              </div>
            onValueChange={(value) => handleFilter('status', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Visited">Visited</SelectItem>
              <SelectItem value="Negotiation">Negotiation</SelectItem>
              <SelectItem value="Converted">Converted</SelectItem>
              <SelectItem value="Dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={city || 'all'}
            onValueChange={(value) => handleFilter('city', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="Chandigarh">Chandigarh</SelectItem>
              <SelectItem value="Mohali">Mohali</SelectItem>
              <SelectItem value="Zirakpur">Zirakpur</SelectItem>
              <SelectItem value="Panchkula">Panchkula</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={propertyType || 'all'}
            onValueChange={(value) => handleFilter('propertyType', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Plot">Plot</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Clear all
            <X className="ml-2 h-4 w-4" />
          </Button>
          
          {status && (
            <div className="text-sm text-muted-foreground">
              Status: <span className="font-medium">{status}</span>
            </div>
          )}
          
          {city && (
            <div className="text-sm text-muted-foreground">
              City: <span className="font-medium">{city}</span>
            </div>
          )}
          
          {propertyType && (
            <div className="text-sm text-muted-foreground">
              Property: <span className="font-medium">{propertyType}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
