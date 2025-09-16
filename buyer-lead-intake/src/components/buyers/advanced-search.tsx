'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Proposal Sent', label: 'Proposal Sent' },
  { value: 'Negotiation', label: 'Negotiation' },
  { value: 'Closed Won', label: 'Closed Won' },
  { value: 'Closed Lost', label: 'Closed Lost' },
];

const CITY_OPTIONS = [
  { value: 'Chandigarh', label: 'Chandigarh' },
  { value: 'Mohali', label: 'Mohali' },
  { value: 'Zirakpur', label: 'Zirakpur' },
  { value: 'Panchkula', label: 'Panchkula' },
  { value: 'Other', label: 'Other' },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Plot', label: 'Plot' },
  { value: 'Office', label: 'Office' },
  { value: 'Retail', label: 'Retail' },
];

interface FilterState {
  search: string;
  status: string[];
  city: string[];
  propertyType: string[];
  dateFrom?: string;
  dateTo?: string;
}

export function AdvancedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    city: [],
    propertyType: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Initialize filters from URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setFilters({
      search: params.get('search') || '',
      status: params.get('status')?.split(',') || [],
      city: params.get('city')?.split(',') || [],
      propertyType: params.get('propertyType')?.split(',') || [],
      dateFrom: params.get('dateFrom') || '',
      dateTo: params.get('dateTo') || '',
    });
  }, [searchParams]);

  const updateUrlParams = (newFilters: Partial<FilterState>) => {
    const params = new URLSearchParams();
    const updatedFilters = { ...filters, ...newFilters };
    
    // Set non-empty filters as URL parameters
    if (updatedFilters.search) params.set('search', updatedFilters.search);
    if (updatedFilters.status.length) params.set('status', updatedFilters.status.join(','));
    if (updatedFilters.city.length) params.set('city', updatedFilters.city.join(','));
    if (updatedFilters.propertyType.length) params.set('propertyType', updatedFilters.propertyType.join(','));
    if (updatedFilters.dateFrom) params.set('dateFrom', updatedFilters.dateFrom);
    if (updatedFilters.dateTo) params.set('dateTo', updatedFilters.dateTo);
    
    // Always reset to first page when filters change
    params.set('page', '1');
    
    router.push(`/buyers?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({});
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key: keyof FilterState, value?: string) => {
    if (key === 'search' || key === 'dateFrom' || key === 'dateTo') {
      updateUrlParams({ [key]: key === 'search' ? '' : undefined });
    } else if (value) {
      const currentValues = [...filters[key] as string[]];
      const newValues = currentValues.filter(v => v !== value);
      updateUrlParams({ [key]: newValues });
    } else {
      updateUrlParams({ [key]: [] });
    }
  };

  const clearAllFilters = () => {
    updateUrlParams({
      search: '',
      status: [],
      city: [],
      propertyType: [],
      dateFrom: '',
      dateTo: '',
    });
  };

  const hasActiveFilters = 
    filters.search ||
    filters.status.length > 0 ||
    filters.city.length > 0 ||
    filters.propertyType.length > 0 ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, phone, or notes..."
            className="w-full pl-8"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
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
                    onClick={clearAllFilters}
                    className="h-8 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !filters.status.includes(value)) {
                      handleFilterChange('status', [...filters.status, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filters.status.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.status.map((status) => (
                      <Badge key={status} variant="secondary" className="gap-1">
                        {status}
                        <button
                          type="button"
                          onClick={() => removeFilter('status', status)}
                          className="ml-1 rounded-full hover:bg-accent"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !filters.city.includes(value)) {
                      handleFilterChange('city', [...filters.city, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filters.city.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.city.map((city) => (
                      <Badge key={city} variant="secondary" className="gap-1">
                        {city}
                        <button
                          type="button"
                          onClick={() => removeFilter('city', city)}
                          className="ml-1 rounded-full hover:bg-accent"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !filters.propertyType.includes(value)) {
                      handleFilterChange('propertyType', [...filters.propertyType, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filters.propertyType.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.propertyType.map((type) => (
                      <Badge key={type} variant="secondary" className="gap-1">
                        {type}
                        <button
                          type="button"
                          onClick={() => removeFilter('propertyType', type)}
                          className="ml-1 rounded-full hover:bg-accent"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs" htmlFor="date-from">
                      From
                    </Label>
                    <Input
                      id="date-from"
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs" htmlFor="date-to">
                      To
                    </Label>
                    <Input
                      id="date-to"
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                {(filters.dateFrom || filters.dateTo) && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleFilterChange('dateFrom', '');
                        handleFilterChange('dateTo', '');
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      Clear dates
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateUrlParams({});
                    setIsFilterOpen(false);
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </form>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <button
                type="button"
                onClick={() => removeFilter('search')}
                className="ml-1 rounded-full hover:bg-accent"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              Status: {status}
              <button
                type="button"
                onClick={() => removeFilter('status', status)}
                className="ml-1 rounded-full hover:bg-accent"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.city.map((city) => (
            <Badge key={city} variant="secondary" className="gap-1">
              City: {city}
              <button
                type="button"
                onClick={() => removeFilter('city', city)}
                className="ml-1 rounded-full hover:bg-accent"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.propertyType.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              Type: {type}
              <button
                type="button"
                onClick={() => removeFilter('propertyType', type)}
                className="ml-1 rounded-full hover:bg-accent"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="secondary" className="gap-1">
              {filters.dateFrom && filters.dateTo
                ? `Date: ${format(new Date(filters.dateFrom), 'MMM d, yyyy')} - ${format(
                    new Date(filters.dateTo),
                    'MMM d, yyyy'
                  )}`
                : filters.dateFrom
                ? `From: ${format(new Date(filters.dateFrom), 'MMM d, yyyy')}`
                : `To: ${format(new Date(filters.dateTo!), 'MMM d, yyyy')}`}
              <button
                type="button"
                onClick={() => {
                  handleFilterChange('dateFrom', '');
                  handleFilterChange('dateTo', '');
                  updateUrlParams({
                    dateFrom: '',
                    dateTo: '',
                  });
                }}
                className="ml-1 rounded-full hover:bg-accent"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
            <X className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
