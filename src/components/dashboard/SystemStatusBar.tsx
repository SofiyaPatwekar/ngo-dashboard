'use client'

import { cn } from '@/lib/utils'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down'
  latency?: string
}

const services: ServiceStatus[] = [
  { name: 'AI Engine',       status: 'operational', latency: '1.2s'  },
  { name: 'Field Reports',   status: 'operational', latency: '0.3s'  },
  { name: 'Assignment API',  status: 'operational', latency: '0.5s'  },
  { name: 'Map Service',     status: 'operational', latency: '0.8s'  },
  { name: 'Alerts',          status: 'operational', latency: '0.1s'  },
  { name: 'Sync',            status: 'degraded',    latency: '4.1s'  },
]

function ServiceDot({ status }: { status: ServiceStatus['status'] }) {
  return (
    <span
      className={cn(
        'inline-block w-1.5 h-1.5 rounded-full',
        status === 'operational' && 'bg-sage-500',
        status === 'degraded'    && 'bg-amber-500 animate-pulse',
        status === 'down'        && 'bg-red-500'
      )}
    />
  )
}

export function SystemStatusBar() {
  const allOperational = services.every((s) => s.status === 'operational')

  return (
    <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-card flex-wrap">
      {/* Overall status */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={cn(
            'text-[10px] font-bold px-2 py-0.5 rounded-md',
            allOperational
              ? 'bg-sage-50 text-sage-700 border border-sage-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          )}
        >
          {allOperational ? '● All Systems Operational' : '● Partial Degradation'}
        </span>
      </div>

      <div className="h-3 w-px bg-gray-200 hidden sm:block" />

      {/* Individual services */}
      <div className="flex items-center gap-4 flex-wrap">
        {services.map((svc) => (
          <div key={svc.name} className="flex items-center gap-1.5">
            <ServiceDot status={svc.status} />
            <span className="text-[10px] text-gray-500">{svc.name}</span>
            {svc.latency && (
              <span className="text-[9px] text-gray-300 font-mono">{svc.latency}</span>
            )}
          </div>
        ))}
      </div>

      {/* Right — last updated */}
      <div className="ml-auto flex-shrink-0">
        <span className="text-[10px] text-gray-400 font-mono">
          Last sync: just now
        </span>
      </div>
    </div>
  )
}
