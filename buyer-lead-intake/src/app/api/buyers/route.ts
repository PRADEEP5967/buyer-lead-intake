import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

// Schema for buyer validation
const buyerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
  city: z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']),
  propertyType: z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']),
  bhk: z.enum(['Studio', 'One', 'Two', 'Three', 'Four']).optional(),
  purpose: z.enum(['Buy', 'Rent']),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  timeline: z.enum(['0-3m', '3-6m', '>6m', 'Exploring']),
  source: z.enum(['Website', 'Referral', 'Social Media', 'Walk-in', 'Other']),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost']).optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  tags: z.array(z.string()).optional(),
});

// Type for the buyer list response
type BuyerListResponse = {
  data: Array<{
    id: string;
    fullName: string;
    email: string | null;
    phone: string;
    city: string;
    propertyType: string;
    bhk: string | null;
    purpose: string;
    budgetMin: number | null;
    budgetMax: number | null;
    timeline: string;
    status: string | null;
    updatedAt: Date;
  }>;
  total: number;
  page: number;
  totalPages: number;
};

// GET /api/buyers - List buyers with pagination and filters
export async function GET(request: Request): Promise<NextResponse<BuyerListResponse | { error: string }>> {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10)) || 1;
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10))) || 10;
    const skip = (page - 1) * limit;
    
    // Filters
    const where: any = { isActive: true };
    
    const search = searchParams.get('search');
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }
    
    // Add filter conditions
    const filterFields = ['city', 'propertyType', 'status', 'purpose'] as const;
    for (const field of filterFields) {
      const value = searchParams.get(field);
      if (value) {
        where[field] = value;
      }
    }
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
    
    const [buyers, total] = await Promise.all([
      prisma.buyer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder } as any, // Type assertion needed for dynamic sorting
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
          timeline: true,
          status: true,
          updatedAt: true,
        },
      }),
      prisma.buyer.count({ where }),
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      data: buyers,
      total,
      page,
      totalPages,
      limit,
    } as BuyerListResponse);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch buyers';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/buyers - Create a new buyer
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
      console.log('Received request body:', body);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    // Log the received body for debugging
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    // Validate request body
    const validation = buyerSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation failed. Issues:', JSON.stringify(validation.error.issues, null, 2));
      console.error('Full error object:', JSON.stringify(validation.error, null, 2));
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          issues: validation.error.issues,
          message: validation.error.errors.map(e => 
            `Field '${e.path.join('.')}': ${e.message}`
          ).join('; ')
        },
        { status: 400 }
      );
    }
    
    const { propertyType, bhk, budgetMin, budgetMax } = validation.data;
    
    // Additional validation for bhk
    if (['Apartment', 'Villa'].includes(propertyType) && !bhk) {
      return NextResponse.json(
        { error: 'BHK is required for Apartment and Villa property types' },
        { status: 400 }
      );
    }
    
    // Validate budget range
    if (budgetMin !== undefined && budgetMax !== undefined && budgetMax < budgetMin) {
      return NextResponse.json(
        { error: 'Maximum budget must be greater than or equal to minimum budget' },
        { status: 400 }
      );
    }
    
    // Prepare buyer data
    const buyerData = {
      ...validation.data,
      ownerId: user.id,
      status: 'New' as const,
      tags: validation.data.tags || [],
      source: validation.data.source === 'Walk-in' ? 'WalkIn' : validation.data.source,
      // Only include bhk for relevant property types
      ...(propertyType && !['Apartment', 'Villa'].includes(propertyType) 
        ? { bhk: null } 
        : { bhk: bhk || null }
      ),
      // Convert empty strings to null for optional fields
      email: validation.data.email || null,
      notes: validation.data.notes || null,
    };
    
    console.log('Creating buyer with data:', buyerData);
    
    // Create buyer first to get the ID
    const newBuyer = await prisma.buyer.create({
      data: buyerData as any, // Type assertion needed for Prisma enums
    });

    // Then create history entry
    await prisma.history.create({
      data: {
        buyerId: newBuyer.id,
        changedBy: user.id,
        diff: Object.entries(buyerData).reduce<Record<string, { from: null; to: unknown }>>((acc, [key, value]) => {
          if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            acc[key] = { from: null, to: value };
          }
          return acc;
        }, {}) as any,
      },
    });
    
    console.log('Successfully created buyer:', newBuyer);
    return NextResponse.json(newBuyer, { status: 201 });
  } catch (error) {
    console.error('Error creating buyer:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create buyer';
    const status = (error && typeof error === 'object' && 'status' in error) 
      ? Number(error.status) 
      : 500;
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}
