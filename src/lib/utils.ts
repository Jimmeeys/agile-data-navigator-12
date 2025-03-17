
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistance } from "date-fns";

// Apply Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date string to a readable format
export function formatDate(dateString: string | Date, formatStr: string = "MMM dd, yyyy") {
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(dateString);
  }
}

// Get relative time (e.g., "2 days ago")
export function getRelativeTime(dateString: string | Date) {
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    console.error("Error getting relative time:", error);
    return String(dateString);
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Generate random ID
export function generateId(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

// Group array by key
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]) || "Other";
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// Extract unique values from an array of objects for a specific key
export function getUniqueValues<T>(array: T[], key: keyof T): string[] {
  const uniqueValues = new Set<string>();
  
  array.forEach(item => {
    const value = String(item[key]);
    if (value) uniqueValues.add(value);
  });
  
  return Array.from(uniqueValues).sort();
}

// Count occurrences of values in an array by a specific key
export function countByKey<T>(array: T[], key: keyof T): Record<string, number> {
  return array.reduce((acc, item) => {
    const value = String(item[key]) || "Unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// Sort array of objects by key
export function sortArrayByKey<T>(
  array: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    // Handle different types
    if (typeof valueA === "string" && typeof valueB === "string") {
      return direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    // Handle dates
    if (valueA instanceof Date && valueB instanceof Date) {
      return direction === "asc"
        ? valueA.getTime() - valueB.getTime()
        : valueB.getTime() - valueA.getTime();
    }
    
    // Handle numbers
    if (typeof valueA === "number" && typeof valueB === "number") {
      return direction === "asc" ? valueA - valueB : valueB - valueA;
    }
    
    // Convert to strings for comparison as fallback
    const strA = String(valueA);
    const strB = String(valueB);
    
    return direction === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });
}

// Filter array by search term across all fields
export function filterBySearchTerm<T extends Record<string, any>>(
  array: T[],
  searchTerm: string
): T[] {
  if (!searchTerm.trim()) return array;
  
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  return array.filter(item => {
    return Object.values(item).some(value => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(normalizedSearchTerm);
    });
  });
}

// Helper to safely access nested object properties
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : null;
  }, obj);
}

// Parse date string to Date object safely
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

// Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Truncate string with ellipsis
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

// Generate CSV from array of objects
export function generateCSV<T extends Record<string, any>>(data: T[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

// Download data as a file
export function downloadFile(data: string, filename: string, type: string): void {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
}
