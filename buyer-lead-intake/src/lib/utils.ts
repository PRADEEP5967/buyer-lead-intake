import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get initials from a full name
export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Get color variant based on status
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-purple-100 text-purple-800',
    'Qualified': 'bg-green-100 text-green-800',
    'Proposal Sent': 'bg-yellow-100 text-yellow-800',
    'Negotiation': 'bg-orange-100 text-orange-800',
    'Closed Won': 'bg-green-100 text-green-800',
    'Closed Lost': 'bg-red-100 text-red-800',
    'default': 'bg-gray-100 text-gray-800',
  };
  return statusMap[status] || statusMap['default'];
}


// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Get icon class for property type
export function getPropertyTypeIcon(type: string): string {
  const baseClass = "h-5 w-5 mr-2 text-gray-500";
  const iconMap: Record<string, string> = {
    'Apartment': '🏢',
    'Villa': '🏡',
    'Plot': '📌',
    'Office': '🏢',
    'Retail': '🏬',
    'default': '🏠'
  };
  
  const icon = iconMap[type] || iconMap['default'];
  return `<span class="${baseClass}">${icon}</span>`;
}
