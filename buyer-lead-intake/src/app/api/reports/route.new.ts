import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Helper function to create JSON responses
const jsonResponse = <T>(data: T, status = 200) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('API Response:', { status, data: JSON.stringify(data, null, 2) });
  }
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  });
};

export async function GET() {
  console.log('Reports API called at:', new Date().toISOString());

  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('No session found, returning 401');
      return jsonResponse(
        { 
          success: false, 
          error: 'Authentication required',
          redirect: '/auth/signin?callbackUrl=' + encodeURIComponent('/reports')
        },
        401
      );
    }

    // Calculate date ranges with timezone handling
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setTime(startOfMonth.getTime() - timezoneOffset);
    
    const startOfLastMonth = new Date(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(), 
                                     now.getMonth() === 0 ? 11 : now.getMonth() - 1, 1);
    startOfLastMonth.setTime(startOfLastMonth.getTime() - timezoneOffset);
    
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    sixMonthsAgo.setTime(sixMonthsAgo.getTime() - timezoneOffset);

    console.log('Starting database queries...');

    // Execute queries one by one for better error tracking
    try {
      // 1. Total leads count
      console.log('Fetching total leads...');
      const totalLeads = await prisma.buyer.count();
      console.log('Total leads:', totalLeads);

      // 2. New leads this month
      console.log('Fetching new leads this month...');
      const newThisMonth = await prisma.buyer.count({
        where: { createdAt: { gte: startOfMonth } }
      });
      console.log('New leads this month:', newThisMonth);

      // 3. New leads last month
      console.log('Fetching new leads last month...');
      const newLastMonth = await prisma.buyer.count({
        where: { 
          createdAt: { 
            gte: startOfLastMonth, 
            lt: startOfMonth 
          } 
        }
      });
      console.log('New leads last month:', newLastMonth);

      // 4. Leads by status
      console.log('Fetching leads by status...');
      const leadsByStatus = await prisma.buyer.groupBy({
        by: ['status'],
        _count: { status: true },
        orderBy: { _count: { status: 'desc' } }
      });
      console.log('Leads by status:', leadsByStatus);

      // 5. Leads by source
      console.log('Fetching leads by source...');
      const leadsBySource = await prisma.buyer.groupBy({
        by: ['source'],
        where: { source: { not: null } },
        _count: true,
        orderBy: { _count: { source: 'desc' } }
      });
      console.log('Leads by source:', leadsBySource);

      // 6. Leads by property type
      console.log('Fetching leads by property type...');
      const leadsByPropertyType = await prisma.buyer.groupBy({
        by: ['propertyType'],
        where: { propertyType: { not: null } },
        _count: true,
        orderBy: { _count: { propertyType: 'desc' } }
      });
      console.log('Leads by property type:', leadsByPropertyType);

      // 7. Converted leads count
      console.log('Fetching converted leads count...');
      const convertedLeads = await prisma.buyer.count({
        where: { status: 'Converted' }
      });
      console.log('Converted leads:', convertedLeads);

      // 8. Converted leads data
      console.log('Fetching converted leads data...');
      const convertedLeadsData = await prisma.buyer.findMany({
        where: { 
          status: 'Converted',
          createdAt: { not: null },
          updatedAt: { not: null }
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          budgetMin: true,
          budgetMax: true
        }
      });
      console.log('Converted leads data count:', convertedLeadsData.length);

      // 9. Monthly conversions (using raw query)
      console.log('Fetching monthly conversions...');
      let monthlyConversions: Array<{ month: string; avgDays: number }> = [];
      try {
        const result = await prisma.$queryRaw<Array<{ month: string; avgDays: number }>>`
          SELECT 
            DATE_FORMAT(updatedAt, '%Y-%m') as month,
            AVG(DATEDIFF(updatedAt, createdAt)) as avgDays
          FROM buyer
          WHERE status = 'Converted' 
            AND updatedAt IS NOT NULL
            AND createdAt IS NOT NULL
            AND createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
          GROUP BY DATE_FORMAT(updatedAt, '%Y-%m')
          ORDER BY month ASC
        `;
        monthlyConversions = result || [];
        console.log('Monthly conversions:', monthlyConversions);
      } catch (sqlError) {
        console.error('Error in monthly conversions query:', sqlError);
        // Continue with empty array if this query fails
      }

      // Calculate metrics
      console.log('Calculating metrics...');
      
      // Calculate monthly change percentage
      const monthlyChange = newLastMonth > 0 
        ? Math.round(((newThisMonth - newLastMonth) / newLastMonth) * 100) 
        : newThisMonth > 0 ? 100 : 0;

      // Calculate conversion rate
      const conversionRate = totalLeads > 0 
        ? Number(((convertedLeads / totalLeads) * 100).toFixed(1))
        : 0;

      // Calculate average conversion time and total value
      let avgConversionTime = 0;
      let totalValue = 0;
      let conversionCount = 0;
      
      if (convertedLeadsData && convertedLeadsData.length > 0) {
        let totalDays = 0;
        let validConversions = 0;
        
        for (const lead of convertedLeadsData) {
          if (lead.updatedAt && lead.createdAt) {
            const daysToConvert = Math.ceil(
              (new Date(lead.updatedAt).getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)
            );
            totalDays += daysToConvert;
            validConversions++;
            
            // Calculate average budget for this lead
            const budgetMin = lead.budgetMin || 0;
            const budgetMax = lead.budgetMax || 0;
            const avgBudget = budgetMin || budgetMax ? (budgetMin + (budgetMax || budgetMin)) / 2 : 0;
            totalValue += avgBudget;
          }
        }
        
        avgConversionTime = validConversions > 0 ? Number((totalDays / validConversions).toFixed(1)) : 0;
        conversionCount = validConversions;
      }
      
      // Calculate average deal size
      const avgDealSize = conversionCount > 0 ? Math.round(totalValue / conversionCount) : 0;

      // Prepare conversion funnel data
      const statusCounts = new Map<string, number>();
      leadsByStatus.forEach((item) => {
        if (item.status) {
          statusCounts.set(item.status, typeof item._count === 'number' ? item._count : 0);
        }
      });

      const conversionFunnel = [
        { name: 'New', value: statusCounts.get('New') || 0 },
        { name: 'Contacted', value: statusCounts.get('Contacted') || 0 },
        { name: 'Qualified', value: statusCounts.get('Qualified') || 0 },
        { name: 'Proposal Sent', value: statusCounts.get('Proposal Sent') || 0 },
        { name: 'Negotiation', value: statusCounts.get('Negotiation') || 0 },
        { name: 'Converted', value: convertedLeads }
      ];

      // Prepare the response data
      const responseData = {
        metrics: {
          totalLeads,
          newThisMonth,
          monthlyChange,
          convertedLeads,
          conversionRate,
          avgConversionTime,
          conversionCount,
          totalValue,
          avgDealSize
        },
        charts: {
          leadsByStatus: leadsByStatus.map((item) => ({
            name: item.status || 'Unknown',
            value: typeof item._count === 'number' ? item._count : 0
          })),
          leadsBySource: leadsBySource.map((item) => ({
            name: item.source || 'Unknown',
            value: typeof item._count === 'number' ? item._count : 0
          })),
          leadsByPropertyType: leadsByPropertyType.map((item) => ({
            name: item.propertyType || 'Unknown',
            value: typeof item._count === 'number' ? item._count : 0
          })),
          conversionFunnel,
          conversionTimeline: monthlyConversions.map((item) => ({
            month: item.month,
            avgDays: Number(item.avgDays?.toFixed(1)) || 0
          }))
        }
      };

      console.log('Successfully generated report data');
      return jsonResponse({ 
        success: true, 
        data: responseData 
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }

  } catch (error) {
    console.error('Error in reports API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return jsonResponse(
      { 
        success: false, 
        error: 'Failed to generate reports',
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { 
          details: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        })
      },
      500
    );
  }
}
