import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Handles conflicts between Tailwind classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency value
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format date to locale string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Check if a date is in the past
 */
export function isOverdue(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d < new Date();
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString();
}

/**
 * Format a date for display in profile (e.g., "February 2026")
 */
export function formatJoinDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Get user initials from name
 */
export function getInitials(name: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Project status configuration
 */
export const STATUS_CONFIG = {
  ACTIVE: {
    label: "Active",
    variant: "default" as const,
    color: "#22c55e",
    bgClass: "bg-green-500",
  },
  ON_HOLD: {
    label: "On Hold",
    variant: "secondary" as const,
    color: "#eab308",
    bgClass: "bg-yellow-500",
  },
  COMPLETED: {
    label: "Completed",
    variant: "outline" as const,
    color: "#6366f1",
    bgClass: "bg-indigo-500",
  },
} as const;

export type ProjectStatus = keyof typeof STATUS_CONFIG;
