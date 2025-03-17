
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse } from "date-fns";

// Utility function to merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to format dates for display
export function formatDate(dateString: string, formatString: string = 'MMM d, yyyy'): string {
  if (!dateString) return '';
  
  try {
    // Try to parse with different formats
    let date: Date;
    
    if (dateString.includes('T')) {
      // ISO format
      date = new Date(dateString);
    } else if (dateString.includes('-')) {
      // YYYY-MM-DD format
      date = parse(dateString, 'yyyy-MM-dd', new Date());
    } else if (dateString.includes('/')) {
      // MM/DD/YYYY format
      date = parse(dateString, 'MM/dd/yyyy', new Date());
    } else {
      // Try as timestamp
      date = new Date(Number(dateString));
    }
    
    // If the date is valid, format it
    if (!isNaN(date.getTime())) {
      return format(date, formatString);
    }
    
    return dateString;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

// Parse dates from string to Date object
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  try {
    // Try to parse with different formats
    let date: Date;
    
    if (dateString.includes('T')) {
      // ISO format
      date = new Date(dateString);
    } else if (dateString.includes('-')) {
      // YYYY-MM-DD format
      date = parse(dateString, 'yyyy-MM-dd', new Date());
    } else if (dateString.includes('/')) {
      // MM/DD/YYYY format
      date = parse(dateString, 'MM/dd/yyyy', new Date());
    } else {
      // Try as timestamp
      date = new Date(Number(dateString));
    }
    
    // If the date is valid, return it
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}

// Helper function to get unique values from an array of objects
export function getUniqueValues(items: any[], key: string): string[] {
  const values = items.map(item => item[key]);
  return [...new Set(values)].filter(Boolean).sort();
}

// Helper function to count occurrences by a property
export function countByKey(items: any[], key: string): Record<string, number> {
  return items.reduce((acc, item) => {
    const value = item[key];
    if (value) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});
}

// Delay utility for simulating API calls
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Format currency values (in INR by default)
export function formatCurrency(value: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

// Format number with thousands separators
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

// Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Format percentage values
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Group data by a key
export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const groupKey = String(item[key] || 'Unknown');
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

// Create slug from string
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Generate a random string (useful for IDs)
export function generateRandomString(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
