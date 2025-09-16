'use client';

import { useEffect, useState } from 'react';

type TestResult = {
  endpoint: string;
  status: number | null;
  statusText: string;
  data: any;
  error?: string;
};

export default function ApiTestPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testEndpoints = async () => {
      const endpoints = [
        '/api/reports/simple-route',
        '/api/test-db',
        '/api/test-db-connection',
        '/api/reports'
      ];

      const testResults: Record<string, TestResult> = {};

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          let data;
          try {
            data = await response.text();
            // Try to parse as JSON if possible
            try {
              data = JSON.parse(data);
            } catch (e) {
              // Not JSON, keep as text
            }
          } catch (e) {
            data = { error: 'Failed to parse response' };
          }

          testResults[endpoint] = {
            endpoint,
            status: response.status,
            statusText: response.statusText,
            data
          };
        } catch (error) {
          testResults[endpoint] = {
            endpoint,
            status: null,
            statusText: 'Error',
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }

      setResults(testResults);
      setIsLoading(false);
    };

    testEndpoints();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-6">Testing API Endpoints...</h1>
        <p>Please wait while we test the API endpoints...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">API Endpoint Test Results</h1>
      
      <div className="space-y-8">
        {Object.entries(results).map(([endpoint, result]) => (
          <div key={endpoint} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{endpoint}</h2>
            <div className="mb-2">
              <span className={`inline-block px-2 py-1 rounded text-sm ${
                result.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {result.status || 'Error'} {result.statusText}
              </span>
            </div>
            
            {result.error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
                <p className="font-medium">Error:</p>
                <pre className="whitespace-pre-wrap">{result.error}</pre>
              </div>
            )}
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Response:</p>
              <pre className="bg-gray-50 p-3 rounded overflow-x-auto text-sm">
                {typeof result.data === 'string' 
                  ? result.data 
                  : JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Troubleshooting Tips:</h3>
        <ul className="list-disc pl-5 space-y-1 text-blue-700">
          <li>Check if your database server is running</li>
          <li>Verify your database connection string in the .env file</li>
          <li>Make sure all required database migrations have been applied</li>
          <li>Check the browser console for additional error details</li>
        </ul>
      </div>
    </div>
  );
}
