import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { 
  AuthUser, 
  ApiResponse, 
  BuyerUpdateData, 
  RouteParams 
} from '@/types';


// Helper function to create consistent API responses
const createApiResponse = <T = any>(
  { success, data, error }: { success: boolean; data?: T; error?: string },
  status = 200
) => {
  return NextResponse.json({ success, data, error } as ApiResponse<T>, { status });
};


// Schema for buyer validation
const updateBuyerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15).optional(),
  city: z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']).optional(),
  propertyType: z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']).optional(),
  bhk: z.enum(['Studio', 'One', 'Two', 'Three', 'Four']).optional().nullable(),
  purpose: z.enum(['Buy', 'Rent']).optional(),
  budgetMin: z.number().int().min(0).optional().nullable(),
  budgetMax: z.number().int().min(0).optional().nullable(),
  timeline: z.enum(['ZeroToThree', 'ThreeToSix', 'MoreThanSix', 'Exploring']).optional(),
  source: z.enum(['Website', 'Referral', 'WalkIn', 'Call', 'Other']).optional(),
  status: z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']).optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional().nullable(),
  tags: z.array(z.string()).optional(),
}).refine(data => {
  // Validate bhk is provided for Apartment/Villa
  if (data.propertyType && (data.propertyType === 'Apartment' || data.propertyType === 'Villa') && data.bhk === undefined) {
    return false;
  }
  // Validate budget range
  if (data.budgetMin !== undefined && data.budgetMin !== null && 
      data.budgetMax !== undefined && data.budgetMax !== null && 
      data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Invalid data',
  path: ['_error'],
});

// GET /api/buyers/[id] - Get a single buyer by ID
export async function GET(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const user = await requireAuth() as AuthUser;
    if (!user?.id) {
      return createApiResponse({
        success: false,
        error: 'Not authenticated',
      }, 401);
    }
    
    const buyer = await prisma.buyer.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        history: {
          orderBy: { changedAt: 'desc' },
          take: 10,
        },
      },
    }) as any;
    
    if (!buyer) {
      return createApiResponse({
        success: false,
        error: 'Buyer not found'
      }, 404);
    }
    
    return createApiResponse({
      success: true,
      data: buyer
    });
  } catch (error) {
    console.error('Error fetching buyer:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch buyer';
    const status = (error && typeof error === 'object' && 'status' in error) 
      ? Number(error.status) 
      : 500;
    return createApiResponse({
      success: false,
      error: errorMessage
    }, status);
  }
}

// PATCH /api/buyers/[id] - Update a buyer
export async function PATCH(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const user = await requireAuth() as AuthUser;
    if (!user?.id) {
      return createApiResponse({
        success: false,
        error: 'Not authenticated',
      }, 401);
    }
    
    const body = await _request.json();
    
    // Check if buyer exists and user has permission
    const buyer = await prisma.buyer.findUnique({
      where: { id: params.id },
      select: { id: true, ownerId: true, updatedAt: true },
    });
    
    if (!buyer) {
      return createApiResponse({
        success: false,
        error: 'Buyer not found'
      }, 404);
    }
    
    // Check ownership
    if (user.id !== buyer.ownerId && user.role !== 'ADMIN') {
      return createApiResponse({
        success: false,
        error: 'You do not have permission to update this buyer'
      }, 403);
    }
    
    // Check for concurrent modification
    if (body.updatedAt && new Date(body.updatedAt).getTime() !== buyer.updatedAt.getTime()) {
      return createApiResponse({
        success: false,
        error: 'This buyer has been modified since you last viewed it. Please refresh and try again.'
      }, 409);
    }
    
    // Validate request body
    const updateData = updateBuyerSchema.parse(body) as BuyerUpdateData;

    // Convert empty strings to null for optional fields
    const cleanedData: Partial<BuyerUpdateData> = {};
    
    // Type guard to check if a key is a valid BuyerUpdateData key
    const isBuyerUpdateKey = (key: string): key is keyof BuyerUpdateData => {
      return key in cleanedData;
    };

    for (const [key, value] of Object.entries(updateData)) {
      if (value === undefined) continue;
      
      if (!isBuyerUpdateKey(key)) continue;
      
      const typedKey = key as keyof BuyerUpdateData;
      
      // Handle empty strings for nullable fields
      if (value === '') {
        if (typedKey === 'email' || typedKey === 'notes' || typedKey === 'bhk') {
          // We know these fields can be null based on the schema
          (cleanedData[typedKey] as unknown) = null;
        }
      } else {
        // Type assertion is safe because we've validated the types with the schema
        (cleanedData[typedKey] as unknown) = value;
      }
    }

    // Convert the cleaned data to match Prisma's expected types
    const prismaUpdateData: any = {
      ...(cleanedData.fullName && { fullName: cleanedData.fullName }),
      ...(cleanedData.email !== undefined && { email: cleanedData.email }),
      ...(cleanedData.phone && { phone: cleanedData.phone }),
      ...(cleanedData.city && { city: cleanedData.city }),
      ...(cleanedData.propertyType && { propertyType: cleanedData.propertyType }),
      ...(cleanedData.bhk !== undefined && { bhk: cleanedData.bhk }),
      ...(cleanedData.purpose && { purpose: cleanedData.purpose }),
      ...(cleanedData.budgetMin !== undefined && { budgetMin: cleanedData.budgetMin }),
      ...(cleanedData.budgetMax !== undefined && { budgetMax: cleanedData.budgetMax }),
      ...(cleanedData.timeline && { timeline: cleanedData.timeline }),
      ...(cleanedData.source && { source: cleanedData.source }),
      ...(cleanedData.status && { status: cleanedData.status }),
      ...(cleanedData.notes !== undefined && { notes: cleanedData.notes }),
      ...(cleanedData.tags && { tags: { set: cleanedData.tags } }),
      // Ensure bhk is null for non-residential properties
      ...(cleanedData.propertyType && !['Apartment', 'Villa'].includes(cleanedData.propertyType) 
        ? { bhk: null } 
        : {}
      ),
    };

    const updatedBuyer = await prisma.$transaction(async (tx) => {
      const buyer = await tx.buyer.update({
        where: { id: params.id },
        data: prismaUpdateData,
      });
      
      // Create history entry
      await tx.history.create({
        data: {
          buyerId: buyer.id,
          changedBy: user.id,
          diff: JSON.parse(JSON.stringify({
            action: 'update',
            fields: cleanedData,
          })) as Prisma.InputJsonValue,
        },
      });
      
      return buyer;
    }) as any; // Type assertion for transaction result
    
    return createApiResponse({
      success: true,
      data: updatedBuyer
    });
  } catch (error) {
    console.error('Error updating buyer:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update buyer';
    const status = (error && typeof error === 'object' && 'status' in error) 
      ? Number(error.status) 
      : 500;
    return createApiResponse({
      success: false,
      error: errorMessage
    }, status);
  }
}

// DELETE /api/buyers/[id] - Delete a buyer
export async function DELETE(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const user = await requireAuth() as AuthUser;
    if (!user?.id) {
      return createApiResponse({
        success: false,
        error: 'Not authenticated',
      }, 401);
    }
    
    // Check if buyer exists and user has permission
    const buyer = await prisma.buyer.findUnique({
      where: { id: params.id },
      select: { id: true, ownerId: true },
    });
    
    if (!buyer) {
      return createApiResponse({
        success: false,
        error: 'Buyer not found'
      }, 404);
    }
    
    // Check ownership
    if (user.id !== buyer.ownerId && user.role !== 'ADMIN') {
      return createApiResponse({
        success: false,
        error: 'You do not have permission to delete this buyer'
      }, 403);
    }
    
    // Delete the buyer and create history in a transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete the buyer
      await tx.buyer.delete({
        where: { id: params.id },
      });
      
      // Create history entry
      await tx.history.create({
        data: {
          buyerId: buyer.id,
          changedBy: user.id,
          diff: JSON.parse(JSON.stringify({
            action: 'delete'
          })) as Prisma.InputJsonValue,
        },
      });
    });
    
    return new NextResponse(JSON.stringify({ success: true }), { 
      status: 204,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting buyer:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete buyer';
    const status = (error && typeof error === 'object' && 'status' in error) 
      ? Number(error.status) 
      : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status }
    );
  }
}
