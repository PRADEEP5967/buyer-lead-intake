import { PrismaClient } from '@prisma/client';

// Add type safety for the global prisma instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a new Prisma client instance with proper error handling
export const prisma: PrismaClient = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// In development, use a global instance to prevent too many clients
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
