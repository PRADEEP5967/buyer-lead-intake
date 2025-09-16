import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { parse } from 'csv-parse/sync';
import { z } from 'zod';


// Schema for CSV row validation
const csvRowSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
  city: z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']),
  propertyType: z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']),
  bhk: z.enum(['Studio', 'One', 'Two', 'Three', 'Four']).optional(),
  purpose: z.enum(['Buy', 'Rent']),
  budgetMin: z.string().transform(Number).optional(),
  budgetMax: z.string().transform(Number).optional(),
  timeline: z.enum(['0-3m', '3-6m', '>6m', 'Exploring']).transform((val) => {
    // Map from CSV values to Prisma enum values
    const map: Record<string, 'ZeroToThree' | 'ThreeToSix' | 'MoreThanSix' | 'Exploring'> = {
      '0-3m': 'ZeroToThree',
      '3-6m': 'ThreeToSix',
      '>6m': 'MoreThanSix',
      'Exploring': 'Exploring'
    };
    return map[val] || 'Exploring';
  }) as unknown as z.ZodType<'ZeroToThree' | 'ThreeToSix' | 'MoreThanSix' | 'Exploring'>,
  source: z.enum(['Website', 'Referral', 'WalkIn', 'Call', 'Other']),
  status: z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']).optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  tags: z.string().transform(str => 
    str ? str.split(',').map(tag => tag.trim()).filter(Boolean) : []
  ).optional(),
}).refine(data => {
  // Validate bhk is provided for Apartment/Villa
  if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
    return false;
  }
  // Validate budget range
  if (data.budgetMin !== undefined && data.budgetMax !== undefined && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Invalid data',
  path: ['_error'],
});

// POST /api/buyers/import - Import buyers from CSV
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    
    // Check if request is multipart/form-data
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }
    
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided or invalid file type' },
        { status: 400 }
      );
    }
    
    // Check file size (max 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }
    
    // Read the file content
    const content = await file.text();
    
    // Parse CSV content
    const records: unknown[] = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    
    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: 'No records found in the CSV file' },
        { status: 400 }
      );
    }
    
    // Limit to 200 rows
    if (records.length > 200) {
      return NextResponse.json(
        { error: 'Maximum 200 rows allowed per import' },
        { status: 400 }
      );
    }
    
    // Get existing emails for duplicate check
    const existingBuyers = await prisma.buyer.findMany({
      where: { email: { not: null } },
      select: { email: true },
    });
    
    const existingEmails = new Set(
      existingBuyers
        .map((buyer: { email: string | null }) => buyer.email)
        .filter((email: string | null): email is string => email !== null)
    );
    
    // Process each record
    const results = await Promise.allSettled(
      records.map(async (row: unknown, index: number) => {
        try {
          // Validate row data
          const validatedData = csvRowSchema.parse(row);
          
          // Check for duplicate email
          if (validatedData.email && existingEmails.has(validatedData.email)) {
            return { 
              status: 'rejected', 
              reason: 'A buyer with this email already exists',
              row: index + 2, // +2 for header row and 1-based index
              data: row
            } as const;
          }
          
          // Add to existing emails to prevent duplicates in the same import
          if (validatedData.email) {
            existingEmails.add(validatedData.email);
          }
          
          // Create buyer in database
          const buyer = await prisma.buyer.create({
            data: {
              fullName: validatedData.fullName,
              email: validatedData.email || null,
              phone: validatedData.phone,
              city: validatedData.city,
              propertyType: validatedData.propertyType,
              bhk: validatedData.bhk || null,
              purpose: validatedData.purpose,
              budgetMin: validatedData.budgetMin || null,
              budgetMax: validatedData.budgetMax || null,
              timeline: validatedData.timeline,
              source: validatedData.source,
              status: validatedData.status || 'New',
              notes: validatedData.notes || null,
              owner: { connect: { id: user.id } },
            },
          });
          
          // Create history entry with simplified changes
          await prisma.history.create({
            data: {
              buyer: { connect: { id: buyer.id } },
              changedByUser: { connect: { id: user.id } },
              diff: JSON.stringify({ action: 'Imported' }),
            },
          });
          
          return { status: 'fulfilled', value: buyer } as const;
        } catch (error) {
          return { 
            status: 'rejected', 
            reason: error instanceof Error ? error.message : 'Unknown error',
            row: index + 2, // +2 for header row and 1-based index
            data: row
          } as const;
        }
      })
    );

    // Process results with type assertions
    const successfulImports: Array<{ id: string }> = [];
    const failedImports: Array<{ row: number; reason: string; data: any }> = [];
    
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === 'fulfilled' && result.value && typeof result.value === 'object' && 'id' in result.value) {
        successfulImports.push({ id: String(result.value.id) });
      } else if (result.status === 'rejected') {
        const row = 'row' in result ? Number(result.row) : i + 2; // Default to index + 2 if row is not available
        const reason = result.reason || 'Unknown error';
        const data = 'data' in result ? result.data : undefined;
        failedImports.push({ row, reason, data });
      }
    }

    // Get detailed error information
    const errors = failedImports.map(r => ({
      row: r.row,
      error: r.reason,
      data: r.data,
    }));

    const successCount = successfulImports.length;
    const errorCount = failedImports.length;

    return NextResponse.json({
      success: errorCount === 0,
      message: `Imported ${successCount} buyers successfully${errorCount > 0 ? `, with ${errorCount} errors` : ''}`,
      total: results.length,
      successCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error importing buyers:', error);
    return NextResponse.json(
      { 
        error: 'Failed to import buyers', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
