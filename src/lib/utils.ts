
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getUniqueValues<T>(items: T[], key: keyof T): string[] {
  const uniqueValues = new Set<string>();
  
  items.forEach(item => {
    const value = item[key];
    if (value && typeof value === 'string') {
      uniqueValues.add(value);
    }
  });
  
  return Array.from(uniqueValues).sort();
}

export function countByKey<T>(items: T[], key: keyof T): Record<string, number> {
  const counts: Record<string, number> = {};
  
  items.forEach(item => {
    const value = item[key];
    if (value && typeof value === 'string') {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  
  return counts;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  
  return ((current - previous) / previous) * 100;
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result: Record<string, T[]>, currentValue: T) => {
    const keyValue = String(currentValue[key] || 'Unknown');
    (result[keyValue] = result[keyValue] || []).push(currentValue);
    return result;
  }, {});
}
