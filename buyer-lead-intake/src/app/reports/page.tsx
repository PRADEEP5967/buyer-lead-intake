import { Metadata } from 'next';
import { ReportsContainer } from '@/components/reports/reports-container';

// This is a server component that fetches data on the server side
export const dynamic = 'force-dynamic';

async function getReportData() {
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/reports`;
  
  try {
    // Attempt to fetch the report data with credentials
    const response = await fetch(apiUrl, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' },
      credentials: 'include', // Include cookies for authentication
    });

    // Check if we got redirected (happens with 3xx status codes)
    if (response.redirected) {
      console.log('Request was redirected, likely due to authentication');
      return null;
    }

    // Check for 401 Unauthorized
    if (response.status === 401) {
      console.log('User is not authenticated, redirecting to login');
      return null;
    }

    // First check the content type to handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // If we get HTML, it's likely an auth redirect page
      if (contentType?.includes('text/html')) {
        console.log('Received HTML response, likely an auth redirect');
        return null;
      }
      console.error('Unexpected content type:', contentType);
      throw new Error(`Unexpected content type: ${contentType}`);
    }

    // If we get here, we should have JSON
    const data = await response.json();
    
    // Check for error responses in the JSON
    if (!response.ok || !data.success) {
      const errorMessage = data?.error || `Failed to fetch report data (${response.status})`;
      console.error('API Error:', response.status, errorMessage, data?.details);
      return null;
    }
    
    // Return the successful data
    return data.data;
    
  } catch (error) {
    // Handle any errors during fetch or JSON parsing
    if (error instanceof Error) {
      console.error('Error in getReportData:', error.message);
    } else {
      console.error('Unknown error in getReportData');
    }
    return null;
  }
}

export const metadata: Metadata = {
  title: 'Reports | Buyer Lead Intake',
  description: 'View and analyze buyer lead reports',
};

export default async function ReportsPage() {
  // Fetch data on the server side
  const initialData = await getReportData();
  
  return <ReportsContainer initialData={initialData} />;
}
