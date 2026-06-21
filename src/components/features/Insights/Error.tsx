import { AlertTriangle, RefreshCw } from 'lucide-react'

interface InsightErrorProps {
  message: string
  onRetry?: () => void
}

export function InsightError({ message, onRetry }: InsightErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
      <div className="bg-red-500/10 flex h-12 w-12 items-center justify-center rounded-full">
        <AlertTriangle size={24} className="text-red-500" />
      </div>
      <div>
        <p className="text-foreground mb-1 font-semibold">
          Não foi possível gerar os insights
        </p>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-primary hover:text-primary/80 flex cursor-pointer items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <RefreshCw size={14} />
          Tentar novamente
        </button>
      )}
    </div>
  )
}
