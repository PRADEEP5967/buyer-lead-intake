import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const buyerCount = await prisma.buyer.count();
    
    return NextResponse.json({
      success: true,
      userCount,
      buyerCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to database',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
