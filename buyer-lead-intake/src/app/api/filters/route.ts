import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/filters - Get filter options for the buyers list
export async function GET() {
  try {
    // Get all distinct values for each filterable field
    const [cities, propertyTypes, purposes, timelines, sources, statuses] = await Promise.all([
      prisma.buyer.findMany({
        distinct: ['city'],
        select: { city: true },
        orderBy: { city: 'asc' },
      }),
      prisma.buyer.findMany({
        distinct: ['propertyType'],
        select: { propertyType: true },
        orderBy: { propertyType: 'asc' },
      }),
      prisma.buyer.findMany({
        distinct: ['purpose'],
        select: { purpose: true },
        orderBy: { purpose: 'asc' },
      }),
      prisma.buyer.findMany({
        distinct: ['timeline'],
        select: { timeline: true },
        orderBy: { timeline: 'asc' },
      }),
      prisma.buyer.findMany({
        distinct: ['source'],
        select: { source: true },
        orderBy: { source: 'asc' },
      }),
      prisma.buyer.findMany({
        distinct: ['status'],
        select: { status: true },
        orderBy: { status: 'asc' },
      }),
    ]);
    
    // Extract values and format for the frontend
    const filters = {
      cities: cities.map((c: { city: string }) => c.city),
      propertyTypes: propertyTypes.map((p: { propertyType: string }) => p.propertyType),
      purposes: purposes.map((p: { purpose: string }) => p.purpose),
      timelines: timelines.map((t: { timeline: string }) => t.timeline),
      sources: sources.map((s: { source: string }) => s.source),
      statuses: statuses.map((s: { status: string }) => s.status),
    };
    
    return NextResponse.json(filters);
  } catch (error) {
    console.error('Error fetching filters:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch filter options';
    const status = (error && typeof error === 'object' && 'status' in error) 
      ? Number(error.status) 
      : 500;
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}
