const { PrismaClient } = require('@prisma/client');

async function checkStatusValues() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Distinct status values in Buyer table:');
    const statusCounts = await prisma.$queryRaw`
      SELECT status, COUNT(*) as count
      FROM "Buyer"
      GROUP BY status
      ORDER BY status;
    `;
    
    console.table(statusCounts);
    
    // Also check if there are any null or empty status values
    const nullStatus = await prisma.$queryRaw`
      SELECT COUNT(*) as null_status_count
      FROM "Buyer"
      WHERE status IS NULL;
    `;
    
    console.log('\nBuyers with NULL status:', nullStatus[0].null_status_count);
    
  } catch (error) {
    console.error('Error checking status values:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStatusValues();
