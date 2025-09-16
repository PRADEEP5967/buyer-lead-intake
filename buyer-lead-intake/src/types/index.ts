// Auth types
export type AuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

// Buyer related enums and types
export type City = 'Chandigarh' | 'Mohali' | 'Zirakpur' | 'Panchkula' | 'Other';
export type PropertyType = 'Apartment' | 'Villa' | 'Plot' | 'Office' | 'Retail';
export type BHK = 'Studio' | 'One' | 'Two' | 'Three' | 'Four';
export type Purpose = 'Buy' | 'Rent';
export type Timeline = 'ZeroToThree' | 'ThreeToSix' | 'MoreThanSix' | 'Exploring';
export type Source = 'Website' | 'Referral' | 'WalkIn' | 'Call' | 'Other';
export type Status = 'New' | 'Qualified' | 'Contacted' | 'Visited' | 'Negotiation' | 'Converted' | 'Dropped';

// API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Buyer update data type
export interface BuyerUpdateData {
  fullName?: string;
  email?: string | null;
  phone?: string;
  city?: City;
  propertyType?: PropertyType;
  bhk?: BHK | null;
  purpose?: Purpose;
  budgetMin?: number | null;
  budgetMax?: number | null;
  timeline?: Timeline;
  source?: Source;
  status?: Status;
  notes?: string | null;
  tags?: string[];
}

// Route params type
export interface RouteParams {
  params: {
    id: string;
  };
}
