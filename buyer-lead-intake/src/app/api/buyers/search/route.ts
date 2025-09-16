import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth-options';
import { BuyerSearchFiltersSchema } from '@/types/buyer';
import { Prisma, Status, City, PropertyType } from '@prisma/client';
import { z } from 'zod';

export async function POST(request: Request) {
  console.log('Received request to /api/buyers/search');
  
  try {
    // First get the session without requiring auth
    console.log('Getting session...');
    const session = await getServerSession(authOptions);
    console.log('Session data:', session);
    
    if (!session?.user?.email) {
      console.log('No session or email found, returning 401');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Then get the user
    console.log('Fetching user from database...');
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log('User not found in database, returning 404');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('User authenticated:', { id: user.id, email: user.email });

    console.log('Parsing request body...');
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
      const filters = BuyerSearchFiltersSchema.parse(body);
      console.log('Validated filters:', filters);

      // Build the where clause
      const where: Prisma.BuyerWhereInput = {};

    // Text search across multiple fields
    if (filters.query) {
      where.OR = [
        { fullName: { contains: filters.query, mode: 'insensitive' } },
        { email: { contains: filters.query, mode: 'insensitive' } },
        { phone: { contains: filters.query } },
        { notes: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    // Status filter - ensure values are valid Status enums
    if (filters.status?.length) {
      const validStatuses = filters.status.filter((s): s is Status => 
        Object.values(Status).includes(s as Status)
      );
      if (validStatuses.length > 0) {
        where.status = { in: validStatuses };
      }
    }

    // City filter - ensure values are valid City enums
    if (filters.city?.length) {
      const validCities = filters.city.filter((c): c is City =>
        Object.values(City).includes(c as City)
      );
      if (validCities.length > 0) {
        where.city = { in: validCities };
      }
    }

    // Property type filter - ensure values are valid PropertyType enums
    if (filters.propertyType?.length) {
      const validPropertyTypes = filters.propertyType.filter((pt): pt is PropertyType =>
        Object.values(PropertyType).includes(pt as PropertyType)
      );
      if (validPropertyTypes.length > 0) {
        where.propertyType = { in: validPropertyTypes };
      }
    }

    // Budget range filter
    if (filters.budgetMin !== undefined || filters.budgetMax !== undefined) {
      where.OR = [
        ...(where.OR || []),
        {
          AND: [
            { budgetMin: { gte: filters.budgetMin } },
            { budgetMax: { lte: filters.budgetMax } },
          ],
        },
      ];
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      where.updatedAt = {
        ...(filters.dateFrom && { gte: new Date(filters.dateFrom) }),
        ...(filters.dateTo && { lte: new Date(filters.dateTo) }),
      };
    }

    // Tags filter
    if (filters.tags?.length) {
      where.tags = { hasSome: filters.tags };
    }

    // Assigned to filter - removed as it's not in the schema
    // if (filters.assignedTo) {
    //   where.assignedToId = filters.assignedTo;
    // }

    try {
      // Initialize variables
      let buyers = [];
      let totalCount = 0;

      // Execute queries in parallel
      const [buyersResult, totalResult] = await Promise.all([
        prisma.buyer.findMany({
          where,
          orderBy: {
            [filters.sortBy]: filters.sortOrder,
          },
          skip: (filters.page - 1) * filters.limit,
          take: filters.limit,
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            city: true,
            propertyType: true,
            bhk: true,
            purpose: true,
            budgetMin: true,
            budgetMax: true,
            status: true,
            updatedAt: true,
            tags: true,
            source: true,
            _count: {
              select: {
                history: true,
              },
            },
          },
        }),
        prisma.buyer.count({ where }),
      ]);

      // Assign results
      buyers = Array.isArray(buyersResult) ? buyersResult : [];
      totalCount = Number(totalResult) || 0;

      // Calculate pagination values
      const page = Math.max(1, Number(filters.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(filters.limit) || 10));
      const totalPages = Math.ceil(totalCount / limit) || 1;

      console.log('Fetched buyers:', { buyers, total: totalCount });

      const responseData = {
        data: buyers,
        meta: {
          total: totalCount,
          page,
          limit,
          totalPages,
        },
      };
      
      console.log('Sending response:', responseData);
      return NextResponse.json(responseData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error parsing request:', error);
      return NextResponse.json(
        { error: 'Invalid request format', details: errorMessage },
        { status: 400 }
      );
    }
    } catch (err) {
      console.error('Error in /api/buyers/search:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      return NextResponse.json(
        { 
          error: 'Failed to fetch buyers', 
          details: errorMessage 
        },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error('Search error:', err);
    
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: err.errors 
        },
        { status: 400 }
      );
    }
    
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      },
      { status: 500 }
    );
  }
}
