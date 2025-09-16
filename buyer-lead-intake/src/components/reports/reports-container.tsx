'use client';

import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { ReportsClient } from '@/components/reports/reports-client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface ReportsContainerProps {
  initialData?: any;
}

interface ReportData {
  metrics: {
    totalLeads: number;
    newThisMonth: number;
    monthlyChange: number;
    convertedLeads: number;
    conversionRate: number;
    avgConversionTime: number;
    conversionCount: number;
    totalValue: number;
    avgDealSize: number;
  };
  charts: {
    leadsByStatus: Array<{ name: string; value: number }>;
    leadsBySource: Array<{ name: string; value: number }>;
    leadsByPropertyType: Array<{ name: string; value: number }>;
    conversionFunnel: Array<{ name: string; value: number }>;
    conversionTimeline: Array<{ month: string; avgDays: number }>;
  };
}

export function ReportsContainer({ initialData }: ReportsContainerProps) {
  const [reportData, setReportData] = useState<ReportData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reports', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store',
        credentials: 'same-origin'
      });

      // Handle non-JSON responses (like HTML redirects)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If we get redirected to login, handle it
        if (response.status === 401 || response.redirected) {
          window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname);
          return null;
        }
        // Log the response text for debugging but don't store it
        const errorText = await response.text();
        console.error('Unexpected response:', errorText);
        throw new Error(`Unexpected response type: ${contentType}. Response: ${errorText.substring(0, 200)}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // Handle authentication redirect from JSON response
      if (data.redirect) {
        window.location.href = data.redirect;
        return null;
      }
      
      if (!response.ok || !data.success) {
        const errorMessage = data.error || data.message || 'Failed to fetch report data';
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      // Ensure we have valid data before setting state
      if (!data.data) {
        throw new Error('No data returned from the server');
      }
      
      setReportData(data.data);
      return data.data;
    } catch (err) {
      console.error('Error fetching report data:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: 'Error loading reports',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    if (!initialData) {
      fetchData();
    }
  }, [fetchData, initialData]);
  
  const handleRefresh = async () => {
    try {
      await fetchData();
      toast({
        title: 'Reports refreshed',
        description: 'The latest data has been loaded.',
      });
    } catch (err) {
      // Error is already handled in fetchData
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Insights and metrics for your buyer leads • Updated {format(new Date(), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last 30 days • {format(new Date(), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>

      {loading && !reportData ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full rounded-lg" />
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error Loading Reports
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={fetchData}
                  className="bg-white text-red-700 hover:bg-red-50 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/40"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : 'Try Again'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : reportData ? (
        <ReportsClient reportData={reportData} onRefresh={fetchData} loading={loading} />
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No data available</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            There is no report data to display at this time.
          </p>
          <div className="mt-6">
            <Button onClick={fetchData} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : 'Refresh Data'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
