import { GET } from '../route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

// Mock the Prisma client
jest.mock('@/lib/db', () => ({
  prisma: {
    buyer: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Mock the requireAuth function
jest.mock('@/lib/auth', () => ({
  requireAuth: jest.fn(() => Promise.resolve({ id: '1', name: 'Test User' })),
}));

describe('GET /api/buyers', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should return a list of buyers', async () => {
    // Mock the Prisma response
    const mockBuyers = [
      {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: 'Two',
        purpose: 'Buy',
        budgetMin: 100000,
        budgetMax: 200000,
        timeline: '0-3m',
        status: 'New',
        updatedAt: new Date(),
      },
    ];

    (prisma.buyer.findMany as jest.Mock).mockResolvedValue(mockBuyers);
    (prisma.buyer.count as jest.Mock).mockResolvedValue(1);

    // Create a mock request with query parameters
    const url = new URL('http://localhost/api/buyers?page=1&limit=10');
    const request = new NextRequest(url);

    // Call the API route
    const response = await GET(request);
    const data = await response.json();

    // Check the response
    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].fullName).toBe('John Doe');
    expect(prisma.buyer.findMany).toHaveBeenCalledTimes(1);
  });
});
