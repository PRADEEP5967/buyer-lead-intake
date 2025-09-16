import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { stringify } from 'csv-stringify/sync';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/buyers/export - Export buyers as CSV
export async function GET(request: Request) {
  try {
    
    const { searchParams } = new URL(request.url);
    
    // Build where clause based on query params
    const where: Prisma.BuyerWhereInput = {};
    
    const search = searchParams.get('search');
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }
    
    const city = searchParams.get('city');
    if (city) where.city = { equals: city as any };
    
    const propertyType = searchParams.get('propertyType');
    if (propertyType) where.propertyType = { equals: propertyType as any };
    
    const status = searchParams.get('status');
    if (status) where.status = { equals: status as any };
    
    const purpose = searchParams.get('purpose');
    if (purpose) where.purpose = { equals: purpose as any };
    
    // Get buyers with applied filters
    const buyers = await prisma.buyer.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
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
        source: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (buyers.length === 0) {
      return NextResponse.json(
        { error: 'No buyers found with the specified filters' },
        { status: 404 }
      );
    }
    
    // Prepare data for CSV
    const csvData = buyers.map((buyer) => {
      const budgetText = (() => {
        if (buyer.budgetMin && buyer.budgetMax) {
          return `${buyer.budgetMin.toLocaleString('en-IN')} - ${buyer.budgetMax.toLocaleString('en-IN')}`;
        }
        if (buyer.budgetMin) {
          return `Above ${buyer.budgetMin.toLocaleString('en-IN')}`;
        }
        if (buyer.budgetMax) {
          return `Below ${buyer.budgetMax.toLocaleString('en-IN')}`;
        }
        return 'Not specified';
      })();

      return {
        'Full Name': buyer.fullName || 'Not specified',
        'Email': buyer.email || 'Not specified',
        'Phone': buyer.phone || 'Not specified',
        'City': buyer.city || 'Not specified',
        'Property Type': buyer.propertyType || 'Not specified',
        'BHK': buyer.bhk || 'Any',
        'Purpose': buyer.purpose || 'Not specified',
        'Budget': budgetText,
        'Timeline': buyer.timeline || 'Not specified',
        'Source': buyer.source || 'Not specified',
        'Status': buyer.status || 'Not specified',
        'Notes': buyer.notes || 'None',
        'Created At': new Date(buyer.createdAt).toLocaleString('en-IN'),
        'Last Updated': new Date(buyer.updatedAt).toLocaleString('en-IN'),
      };
    });
    
    // Convert to CSV
    const csv = stringify(csvData, {
      header: true,
      quoted_string: true,
    });
    
    // Create a response with the CSV file
    const response = new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=buyers_export.csv',
      },
    });
    
    return response;
  } catch (error) {
    console.error('Error exporting buyers:', error);
    return NextResponse.json(
      { error: 'Failed to export buyers' },
      { status: 500 }
    );
  }
}
