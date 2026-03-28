import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helpers
export function formattedPrice(price: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', 
  }).format(Number(price) / 100);
};

export function formattedDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};
