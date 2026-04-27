import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import type { Priority, CaseType } from '@/types'

// ─── Class Merging ────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date Formatting ─────────────────────────────────────────────────────────

export function formatTime(date: Date): string {
  return format(date, 'HH:mm')
}

export function formatRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatDateTime(date: Date): string {
  return format(date, 'MMM d, HH:mm')
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Priority Styling ─────────────────────────────────────────────────────────

export function getPriorityConfig(priority: Priority) {
  const configs = {
    critical: {
      label: 'Critical',
      dot:   'bg-red-500',
      badge: 'bg-red-50 text-red-700 border-red-200',
      bar:   'bg-red-500',
      ring:  'ring-red-200',
    },
    high: {
      label: 'High',
      dot:   'bg-orange-500',
      badge: 'bg-orange-50 text-orange-700 border-orange-200',
      bar:   'bg-orange-500',
      ring:  'ring-orange-200',
    },
    medium: {
      label: 'Medium',
      dot:   'bg-amber-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      bar:   'bg-amber-400',
      ring:  'ring-amber-200',
    },
    low: {
      label: 'Low',
      dot:   'bg-sage-500',
      badge: 'bg-sage-50 text-sage-700 border-sage-200',
      bar:   'bg-sage-400',
      ring:  'ring-sage-200',
    },
  }
  return configs[priority]
}

// ─── Case Type Styling ────────────────────────────────────────────────────────

export function getCaseTypeConfig(type: CaseType) {
  const configs = {
    medical: {
      label: 'Medical',
      icon:  '🏥',
      color: 'text-red-600',
      bg:    'bg-red-50',
      border:'border-red-100',
      bar:   'bg-red-400',
    },
    food: {
      label: 'Food',
      icon:  '🥘',
      color: 'text-amber-600',
      bg:    'bg-amber-50',
      border:'border-amber-100',
      bar:   'bg-amber-400',
    },
    shelter: {
      label: 'Shelter',
      icon:  '🏕️',
      color: 'text-sage-600',
      bg:    'bg-sage-50',
      border:'border-sage-100',
      bar:   'bg-sage-500',
    },
    rescue: {
      label: 'Rescue',
      icon:  '🚨',
      color: 'text-orange-600',
      bg:    'bg-orange-50',
      border:'border-orange-100',
      bar:   'bg-orange-400',
    },
    logistics: {
      label: 'Logistics',
      icon:  '📦',
      color: 'text-blue-600',
      bg:    'bg-blue-50',
      border:'border-blue-100',
      bar:   'bg-blue-400',
    },
  }
  return configs[type]
}

// ─── Number Formatting ────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function formatTrend(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value}%`
}
