import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format paise as Indian Rupee string */
export function formatPrice(paise: number, options?: { compact?: boolean }): string {
  if (options?.compact && paise >= 100000) {
    return `₹${(paise / 10000000).toFixed(1)}L`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(paise / 100)
}

/** Convert INR to paise (for form inputs) */
export function toPaise(inr: number): number {
  return Math.round(inr * 100)
}

/** Convert paise to INR (for display/form defaults) */
export function toInr(paise: number): number {
  return paise / 100
}

/** Format date for display */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

/** Format datetime for display */
export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

/** Validate Indian mobile number */
export function isValidMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile.replace(/\s|-/g, ''))
}

/** Validate GSTIN format */
export function isValidGSTIN(gstin: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)
}

/** Validate PIN code */
export function isValidPincode(pin: string): boolean {
  return /^[0-9]{6}$/.test(pin)
}

/** Generate slug from string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Truncate text */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/** Check if a slot is for today */
export function isSlotToday(slot: { day_of_week?: number | null; slot_date?: string | null }): boolean {
  const today = new Date()
  if (slot.slot_date) {
    return new Date(slot.slot_date).toDateString() === today.toDateString()
  }
  return slot.day_of_week === today.getDay()
}

/** Get status color */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending_confirmation: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready_for_pickup: 'bg-green-100 text-green-800',
    out_for_delivery: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    payment_failed: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
