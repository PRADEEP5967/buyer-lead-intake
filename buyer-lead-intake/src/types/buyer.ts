import { z } from 'zod';

export const BuyerSearchFiltersSchema = z.object({
  query: z.string().optional(),
  status: z.array(z.string()).optional(),
  city: z.array(z.string()).optional(),
  propertyType: z.array(z.string()).optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  tags: z.array(z.string()).optional(),
  assignedTo: z.string().optional(),
  sortBy: z.string().default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type BuyerSearchFilters = z.infer<typeof BuyerSearchFiltersSchema>;

export interface Buyer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  propertyType: string;
  bhk: string;
  purpose: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  timeline: string;
  source: string;
  status: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  image?: string | null;
  _count?: {
    history: number;
  };
}

export interface BuyersTableProps {
  search: string;
  status: string[];
  city: string[];
  propertyType: string[];
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
}

export interface BuyersResponse {
  data: Buyer[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
