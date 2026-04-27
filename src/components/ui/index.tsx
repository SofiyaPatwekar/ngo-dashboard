'use client'

import { cn } from '@/lib/utils'
import type { Priority, CaseType } from '@/types'
import { getPriorityConfig, getCaseTypeConfig } from '@/lib/utils'

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
  const paddings = {
    none: '',
    sm:   'p-4',
    md:   'p-5',
    lg:   'p-6',
  }
  return (
    <div
      className={cn(
        'card-base',
        paddings[padding],
        hover && 'hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface SectionProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Section({ title, subtitle, action, children, className }: SectionProps) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </section>
  )
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

interface PriorityBadgeProps {
  priority: Priority
  size?: 'sm' | 'md'
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const cfg = getPriorityConfig(priority)
  return (
    <span
      className={cn(
        'badge-base',
        cfg.badge,
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
      )}
    >
      <span className={cn('inline-block w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

// ─── Case Type Badge ──────────────────────────────────────────────────────────

interface CaseTypeBadgeProps {
  type: CaseType
}

export function CaseTypeBadge({ type }: CaseTypeBadgeProps) {
  const cfg = getCaseTypeConfig(type)
  return (
    <span
      className={cn(
        'badge-base border',
        cfg.bg,
        cfg.color,
        cfg.border
      )}
    >
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}

// ─── Stat Delta ───────────────────────────────────────────────────────────────

interface StatDeltaProps {
  value: number
  className?: string
}

export function StatDelta({ value, className }: StatDeltaProps) {
  const positive = value >= 0
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-xs font-semibold',
        positive ? 'text-sage-600' : 'text-red-500',
        className
      )}
    >
      <span>{positive ? '↑' : '↓'}</span>
      <span>{Math.abs(value)}%</span>
    </span>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-md bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100',
            'bg-[length:200%_100%] animate-shimmer',
            'h-4',
            className
          )}
        />
      ))}
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number // 0–100
  color?: string
  height?: string
  className?: string
  animated?: boolean
}

export function ProgressBar({
  value,
  color = 'bg-sage-500',
  height = 'h-1.5',
  className,
  animated = false,
}: ProgressBarProps) {
  return (
    <div className={cn('w-full rounded-full bg-gray-100 overflow-hidden', height, className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-700', color, animated && 'animate-pulse-slow')}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

// ─── Live Indicator ───────────────────────────────────────────────────────────

export function LiveIndicator({ label = 'Live' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="live-ring">
        <span className="absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75 animate-ping" />
        <span className="live-dot" />
      </span>
      <span className="text-xs font-semibold text-sage-600">{label}</span>
    </div>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px bg-gray-100', className)} />
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
}

export function EmptyState({ icon = '📭', title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
      <span className="text-3xl">{icon}</span>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      {description && <p className="text-xs text-gray-400 max-w-xs">{description}</p>}
    </div>
  )
}

// ─── Confidence Chip ──────────────────────────────────────────────────────────

export function ConfidenceChip({ value }: { value: number }) {
  const color =
    value >= 90 ? 'text-sage-700 bg-sage-50 border-sage-200' :
    value >= 75 ? 'text-amber-700 bg-amber-50 border-amber-200' :
                  'text-gray-600 bg-gray-50 border-gray-200'
  return (
    <span className={cn('badge-base font-mono', color)}>
      {value}% conf.
    </span>
  )
}
