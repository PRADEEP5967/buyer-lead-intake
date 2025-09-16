'use client';

import { Building, Home } from "lucide-react";
import React from "react";

interface PropertyTypeIconProps {
  type: string;
  className?: string;
}

export function PropertyTypeIcon({ type, className = "h-4 w-4" }: PropertyTypeIconProps) {
  const iconMap: Record<string, JSX.Element> = {
    'Apartment': <Building className={className} />,
    'Villa': <Home className={className} />,
    'Plot': <div className={`${className} rounded-full border border-current`} />,
    'Office': <Building className={className} />,
    'Retail': <Building className={className} />,
  };

  return iconMap[type] || <Building className={className} />;
}
