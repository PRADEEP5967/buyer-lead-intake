'use client';

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Users, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Format numbers with commas
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Format percentages
const formatPercent = (value: number) => {
  return `${Math.round(value)}%`;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-sm">{payload[0].value} {payload[0].name === 'value' ? 'leads' : ''}</p>
      </div>
    );
  }
  return null;
};

// Custom legend formatter
const renderColorfulLegendText = (value: string) => {
  return <span className="text-sm text-muted-foreground">{value}</span>;
};

interface ReportMetrics {
  totalLeads: number;
  newThisMonth: number;
  monthlyChange: number;
  convertedLeads: number;
  conversionRate: number;
  avgConversionTime: number;
  conversionCount: number;
  totalValue: number;
  avgDealSize: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface ReportCharts {
  leadsByStatus: ChartData[];
  leadsBySource: ChartData[];
  leadsByPropertyType: ChartData[];
  conversionFunnel: ChartData[];
  conversionTimeline: Array<{ month: string; avgDays: number }>;
}

interface ReportsClientProps {
  reportData: {
    metrics: ReportMetrics;
    charts: ReportCharts;
  };
  onRefresh?: () => Promise<void>;
  loading?: boolean;
}

export function ReportsClient({ reportData, onRefresh, loading = false }: ReportsClientProps) {
  // Handle loading state
  if (loading) {
    return (
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
      </div>
    );
  }

  // Handle no data state or error
  if (!reportData || !reportData.metrics || Object.keys(reportData.metrics).length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>No Data Available</CardTitle>
            </div>
            <CardDescription>
              We couldn't find any report data to display. This might be because there's no data in the system yet, or there was an error loading the reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={onRefresh}
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                No Data Available
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>Unable to load report data. The data might be empty or there might be an issue with the server.</p>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="bg-white text-yellow-700 hover:bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-200 dark:hover:bg-yellow-900/40"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { metrics, charts } = reportData;
  
  // Prepare data for charts with fallbacks
  const leadsByStatusData = charts?.leadsByStatus || [];
  const leadsBySourceData = charts?.leadsBySource || [];
  const leadsByPropertyTypeData = charts?.leadsByPropertyType || [];
  const conversionFunnelData = charts?.conversionFunnel || [];
  const conversionTimelineData = charts?.conversionTimeline || [];
  
  // Process chart data with fallbacks
  const processedLeadsByStatus = (leadsByStatusData || []).map(item => ({
    name: item.name || 'Unknown',
    value: item.value || 0
  }));

  const processedLeadsBySource = (leadsBySourceData || []).map(item => ({
    name: item.name || 'Unknown',
    value: item.value || 0
  }));

  const processedLeadsByPropertyType = (leadsByPropertyTypeData || []).map(item => ({
    name: item.name || 'Unknown',
    value: item.value || 0
  }));

  // Use actual data for monthly trend if available, otherwise show empty state
  const monthlyTrendData = (conversionTimelineData && conversionTimelineData.length > 0) 
    ? conversionTimelineData.map(item => ({
        name: item.month || 'Unknown',
        leads: item.avgDays ? Math.round(item.avgDays * 10) / 10 : 0
      }))
    : [
        { name: 'Jan', leads: 0 },
        { name: 'Feb', leads: 0 },
        { name: 'Mar', leads: 0 },
        { name: 'Apr', leads: 0 },
        { name: 'May', leads: 0 },
        { name: 'Jun', leads: 0 },
      ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? formatNumber(metrics.totalLeads) : <Skeleton className="h-8 w-20" />}
            </div>
            <p className="text-xs text-muted-foreground">All-time total leads</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? formatNumber(metrics.newThisMonth) : <Skeleton className="h-8 w-20" />}
            </div>
            <p className={`text-xs ${metrics?.monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics ? `${metrics.monthlyChange >= 0 ? '+' : ''}${metrics.monthlyChange}% from last month` : 'Loading...'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? formatPercent(metrics.conversionRate) : <Skeleton className="h-8 w-12" />}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics ? `${metrics.convertedLeads} out of ${metrics.totalLeads} leads` : 'Loading...'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time to Convert</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? `${metrics.avgConversionTime} days` : <Skeleton className="h-8 w-16" />}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics ? `Based on ${metrics.conversionCount} conversions` : 'Loading...'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="conversion">
            Conversion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Lead Status Distribution</CardTitle>
              <CardDescription>Breakdown of leads by status</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {leadsByStatusData.length > 0 ? (
                <div className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadsByStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {leadsByStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend formatter={renderColorfulLegendText} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No lead status data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Leads by Source</CardTitle>
                <CardDescription>Where your leads are coming from</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {leadsBySourceData.length > 0 ? (
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={leadsBySourceData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="value" name="Leads" fill="#8884d8" radius={[0, 4, 4, 0]}>
                          {leadsBySourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No source data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Leads by Property Type</CardTitle>
                <CardDescription>What your leads are interested in</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {leadsByPropertyTypeData.length > 0 ? (
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={leadsByPropertyTypeData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="value" name="Leads" fill="#82ca9d" radius={[4, 4, 0, 0]}>
                          {leadsByPropertyTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No property type data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Monthly Lead Trend</CardTitle>
              <CardDescription>New leads over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyTrendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="leads" 
                      name="New Leads" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Lead progression through the sales funnel</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {conversionFunnelData.length > 0 ? (
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={conversionFunnelData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Leads" fill="#8884d8" radius={[0, 4, 4, 0]}>
                          {conversionFunnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No conversion funnel data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Conversion Timeline</CardTitle>
                <CardDescription>Average time to convert (days)</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {conversionTimelineData.length > 0 ? (
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={conversionTimelineData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="avgDays" 
                          name="Avg. Days to Convert" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No conversion timeline data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <div className="text-3xl font-bold">
                  {metrics ? formatPercent(metrics.conversionRate) : <Skeleton className="h-8 w-20" />}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {metrics ? (
                    <>
                      <span className="font-medium">{metrics.convertedLeads.toLocaleString()}</span> out of{' '}
                      <span className="font-medium">{metrics.totalLeads.toLocaleString()}</span> leads converted
                    </>
                  ) : (
                    'Loading...'
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Avg. Time to Convert</CardTitle>
                <div className="text-3xl font-bold">
                  {metrics ? `${metrics.avgConversionTime} days` : <Skeleton className="h-8 w-16" />}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {metrics ? (
                    `Based on ${metrics.conversionCount.toLocaleString()} conversions`
                  ) : (
                    'Loading...'
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Conversion Value</CardTitle>
                <div className="text-3xl font-bold">
                  {metrics?.totalValue ? (
                    `₹${(metrics.totalValue / 10000000).toFixed(1)} Cr`
                  ) : (
                    <Skeleton className="h-8 w-24" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {metrics?.avgDealSize ? (
                    `Avg. deal size: ₹${(metrics.avgDealSize / 100000).toFixed(1)} L`
                  ) : (
                    'Loading...'
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
