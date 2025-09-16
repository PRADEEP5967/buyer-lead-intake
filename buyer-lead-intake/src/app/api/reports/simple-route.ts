import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return a simple test response
    return NextResponse.json({
      success: true,
      message: 'Test response from simple API route',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Simple route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
