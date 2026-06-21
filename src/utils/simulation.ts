import type { SimulationFormData } from '../data/simulation'
import { parseCurrency } from './currency'

export function calcMonthlySavings(data: SimulationFormData): number {
  return (
    parseCurrency(data.income) -
    parseCurrency(data.expenses) -
    parseCurrency(data.debts)
  )
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
