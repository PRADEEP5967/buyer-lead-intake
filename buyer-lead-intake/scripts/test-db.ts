import { PrismaClient } from '@prisma/client';

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Successfully connected to database');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Test query result:', result);
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    
    // Count buyers
    const buyerCount = await prisma.buyer.count();
    console.log(`Found ${buyerCount} buyers in the database`);
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .catch(console.error)
  .finally(() => process.exit(0));
