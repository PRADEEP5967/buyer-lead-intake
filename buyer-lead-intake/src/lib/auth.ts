import { authOptions } from './auth-options';
import { getServerSession } from 'next-auth';
import { prisma } from './db';

type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role?: string; // Make role optional to match Prisma model
  createdAt: Date;
  updatedAt: Date;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  
  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
};

export const requireAuth = async (): Promise<User> => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user;
};

export const checkOwnership = async (buyerId: string, userId: string): Promise<boolean> => {
  const buyer = await prisma.buyer.findUnique({
    where: { id: buyerId },
    select: { ownerId: true },
  });
  
  return buyer?.ownerId === userId;
};
