
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, formatString: string = "MMM dd, yyyy"): string {
  if (!date) return "N/A";
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "Invalid Date";
    return format(parsedDate, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
}

export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  try {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return null;
    return parsedDate;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }
  
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    ...options
  }).format(value);
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  
  const change = ((current - previous) / Math.abs(previous)) * 100;
  
  // Return with 1 decimal place precision
  return parseFloat(change.toFixed(1));
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getUniqueValues<T>(items: T[], key: keyof T): string[] {
  const values = items
    .map(item => String(item[key]))
    .filter(Boolean);
  
  return Array.from(new Set(values)).sort();
}

export function countByKey<T>(items: T[], key: keyof T): Record<string, number> {
  return items.reduce((acc: Record<string, number>, item) => {
    const value = String(item[key] || 'Unknown');
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce((acc: Record<string, T[]>, item) => {
    const value = String(item[key] || 'Unknown');
    if (!acc[value]) {
      acc[value] = [];
    }
    acc[value].push(item);
    return acc;
  }, {});
}
