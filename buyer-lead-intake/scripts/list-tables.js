const { PrismaClient } = require('@prisma/client');

async function listTables() {
  const prisma = new PrismaClient();
  try {
    // This is a raw SQL query to list all tables in the public schema
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log('Database tables:');
    console.table(result);
  } catch (error) {
    console.error('Error listing tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listTables();
