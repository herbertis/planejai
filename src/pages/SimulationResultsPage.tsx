import {
  CalendarClock,
  CreditCard as CreditCardIcon,
  Goal,
  Landmark,
  PiggyBank,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { useParams } from 'react-router-dom'

import { InsightContent } from '@/components/features/Insights/Content'
import { InsightError } from '@/components/features/Insights/Error'
import { Card } from '@/components/features/SimulationResults/Card'
import { PageHero } from '@/components/shared/PageHero'
import { useInsight } from '@/hooks/useInsight'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings, formatCurrency } from '@/utils/simulation'

export function SimulationResultsPage() {
  const { id } = useParams<{ id: string }>()
  const { getFormData } = useSimulationStorage()
  const data = id ? getFormData(id) : null
  const { state: insightState, retry: retryInsight } = useInsight(data)

  if (!data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <p className="text-muted-foreground">Simulação não encontrada.</p>
      </main>
    )
  }

  const monthlySavings = calcMonthlySavings(data)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Resultado da sua simulação"
        subtitle="Com base no seu perfil financeiro e objetivos."
      />

      {/* Cards superiores */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          icon={Goal}
          label="Custo da Meta"
          value={data.goalAmount}
          subtitle={data.goalName}
        />
        <Card
          icon={CalendarClock}
          label="Prazo"
          value={`${data.goalDeadline} meses`}
          subtitle="Prazo para atingir a meta"
        />
        <Card
          variant="primary"
          icon={PiggyBank}
          label="Economia mensal"
          value={`R$ ${formatCurrency(monthlySavings)}`}
          subtitle="Sobra mensal disponível"
        />
      </div>

      {/* Grid principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Painel de Insights */}
        <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
          <div className="mb-6 flex items-center gap-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
              <Sparkles size={16} className="text-primary" />
            </div>
            <h2 className="text-primary text-xs font-semibold tracking-widest uppercase">
              Insights com IA
            </h2>
          </div>

          {insightState.status === 'loading' && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="bg-skeleton-base h-4 w-3/4 animate-pulse rounded-full" />
                  <div className="bg-skeleton-base h-3 w-full animate-pulse rounded-full" />
                  <div className="bg-skeleton-base h-3 w-5/6 animate-pulse rounded-full" />
                </div>
              ))}
            </div>
          )}

          {insightState.status === 'error' && (
            <InsightError message={insightState.message} onRetry={retryInsight} />
          )}

          {insightState.status === 'success' && (
            <InsightContent insight={insightState.data} />
          )}

          {insightState.status === 'idle' && (
            <p className="text-muted-foreground text-sm">
              Aguardando dados...
            </p>
          )}
        </div>

        {/* Cards laterais */}
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <Card
            icon={Wallet}
            label="Renda mensal"
            value={data.income}
            subtitle="Renda total bruta por mês"
          />
          <Card
            icon={CreditCardIcon}
            label="Custos Fixos de Vida"
            value={data.expenses}
            subtitle="Gastos essenciais por mês"
          />
          <Card
            icon={Landmark}
            label="Dívidas / Parcelas"
            value={data.debts}
            subtitle="Valor comprometido em parcelas"
          />
        </div>
      </div>
    </main>
  )
}
