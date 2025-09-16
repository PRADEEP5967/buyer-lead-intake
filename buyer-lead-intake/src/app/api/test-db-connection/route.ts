import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      testQuery: result
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
