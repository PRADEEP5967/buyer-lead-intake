'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testEndpoints = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Test simple API endpoint
        const simpleRes = await fetch('/api/reports/simple-route');
        const simpleData = await simpleRes.text();
        
        // Test database endpoint
        const dbRes = await fetch('/api/test-db');
        const dbData = await dbRes.text();
        
        // Test main reports endpoint
        let reportsData = null;
        try {
          const res = await fetch('/api/reports');
          reportsData = await res.text();
        } catch (e) {
          console.error('Reports endpoint error:', e);
        }
        
        setApiResponse({
          simpleEndpoint: {
            status: simpleRes.status,
            data: simpleData
          },
          dbEndpoint: {
            status: dbRes.status,
            data: dbData
          },
          reportsEndpoint: reportsData ? {
            data: reportsData
          } : 'Failed to fetch reports endpoint'
        });
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    testEndpoints();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading test data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Results</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Simple Endpoint</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          Status: {apiResponse?.simpleEndpoint.status}
          {JSON.stringify(JSON.parse(apiResponse?.simpleEndpoint.data || '{}'), null, 2)}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Database Test Endpoint</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          Status: {apiResponse?.dbEndpoint.status}
          {JSON.stringify(JSON.parse(apiResponse?.dbEndpoint.data || '{}'), null, 2)}
        </pre>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Reports Endpoint</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
          {typeof apiResponse?.reportsEndpoint === 'string' 
            ? apiResponse.reportsEndpoint 
            : apiResponse?.reportsEndpoint?.data || 'No data'}
        </pre>
      </div>
    </div>
  );
}
