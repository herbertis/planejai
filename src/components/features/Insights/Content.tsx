import { CheckCircle2, Lightbulb, Stethoscope, TrendingDown, TrendingUp, XCircle } from 'lucide-react'

import type { AIInsight } from '@/services/aiService'

interface InsightContentProps {
  insight: AIInsight
}

const feasibilityConfig = {
  viable: {
    icon: CheckCircle2,
    label: 'Meta viável',
    className: 'text-green-500',
    bgClassName: 'bg-green-500/10',
  },
  needs_adjustment: {
    icon: TrendingUp,
    label: 'Precisa de ajustes',
    className: 'text-yellow-500',
    bgClassName: 'bg-yellow-500/10',
  },
  unfeasible: {
    icon: XCircle,
    label: 'Meta inviável',
    className: 'text-red-500',
    bgClassName: 'bg-red-500/10',
  },
}

export function InsightContent({ insight }: InsightContentProps) {
  const { feasibility, diagnosis, tips } = insight
  const config = feasibilityConfig[feasibility.status]
  const FeasibilityIcon = config.icon

  return (
    <div className="flex flex-col gap-6">
      {/* Viabilidade */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div
            className={[
              'flex h-8 w-8 items-center justify-center rounded-full',
              config.bgClassName,
            ].join(' ')}
          >
            <FeasibilityIcon size={16} className={config.className} />
          </div>
          <span
            className={[
              'text-xs font-semibold tracking-widest uppercase',
              config.className,
            ].join(' ')}
          >
            {config.label}
          </span>
        </div>
        <p className="text-foreground text-sm leading-relaxed">
          {feasibility.content}
        </p>
      </div>

      <div className="bg-border h-px w-full" />

      {/* Diagnóstico */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <Stethoscope size={16} className="text-primary" />
          </div>
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Diagnóstico
          </span>
        </div>
        <p className="text-foreground text-sm leading-relaxed">
          {diagnosis.content}
        </p>
      </div>

      <div className="bg-border h-px w-full" />

      {/* Dicas */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <Lightbulb size={16} className="text-primary" />
          </div>
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Dicas personalizadas
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-3">
              <div className="bg-muted-primary mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                <span className="text-primary text-[10px] font-bold">
                  {i + 1}
                </span>
              </div>
              <div>
                <p className="text-foreground mb-1 text-sm font-semibold">
                  {tip.title}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {tip.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
