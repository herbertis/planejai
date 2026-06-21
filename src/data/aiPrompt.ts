import type { SimulationRecord } from '@/hooks/useSimulationStorage'
import { parseCurrency } from '@/utils/currency'
import { calcMonthlySavings } from '@/utils/simulation'

const RESPONSE_SCHEMA = `{
  "feasibility": {
    "status": "viable" | "needs_adjustment" | "unfeasible",
    "content": "<Análise objetiva sobre se a meta é atingível no prazo com o valor disponível. Mencione os números relevantes.>"
  },
  "diagnosis": {
    "content": "<Diagnóstico focado no comprometimento do orçamento: quanto % da renda está comprometida com gastos fixos e dívidas, e quanto sobra.>"
  },
  "tips": [
    {
      "title": "<Título curto e direto da dica>",
      "content": "<Explicação prática e objetiva. Evite conselhos genéricos.>"
    }
  ]
}`

export function buildAIPrompt(data: SimulationRecord): string {
  const monthlySavings = calcMonthlySavings(data)
  const income = parseCurrency(data.income)
  const expenses = parseCurrency(data.expenses)
  const debts = parseCurrency(data.debts)
  const goalAmount = parseCurrency(data.goalAmount)
  const commitmentRate = Math.round(((expenses + debts) / income) * 100)
  const monthsNeeded =
    monthlySavings > 0 ? Math.ceil(goalAmount / monthlySavings) : Infinity

  return `Você é um educador financeiro brasileiro direto, empático e especialista em finanças pessoais. Seu papel é analisar o perfil financeiro do usuário e fornecer insights personalizados e acionáveis.

## Contexto de exibição
Sua resposta será exibida em cards dentro de uma interface web. Use linguagem natural, clara e motivadora, sem markdown (sem asteriscos, sem hashes). Escreva em segunda pessoa (você).

## Dados do usuário
- Renda mensal bruta: R$ ${data.income}
- Gastos fixos mensais: R$ ${data.expenses}
- Dívidas/parcelas mensais: R$ ${data.debts}
- Meta financeira: ${data.goalName}
- Valor da meta: R$ ${data.goalAmount}
- Prazo desejado: ${data.goalDeadline} meses

## Valores calculados (use estes exatos valores nos seus textos)
- Comprometimento do orçamento: ${commitmentRate}% da renda
- Sobra mensal disponível: R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Meses reais necessários para a meta (com a sobra atual): ${monthsNeeded === Infinity ? 'indefinido (sem sobra)' : monthsNeeded}
- Meses desejados pelo usuário: ${data.goalDeadline}

## Critérios de viabilidade
- "viable": a sobra mensal cobre o valor necessário dentro do prazo desejado (ou antes)
- "needs_adjustment": a meta é possível, mas exige ajustes no orçamento ou extensão do prazo
- "unfeasible": não há sobra suficiente para atingir a meta em nenhum prazo realista

## Regras
- Não repita os dados brutos fornecidos acima literalmente
- Forneça exatamente 3 dicas práticas e específicas para o perfil deste usuário
- Cada dica deve ter entre 2 e 4 frases
- Não use expressões vagas como "considere reduzir gastos" sem especificar quais
- Não invente dados que não foram fornecidos

## Formato de saída
Retorne APENAS um JSON válido, sem nenhum texto antes ou depois, seguindo exatamente este schema:

${RESPONSE_SCHEMA}`
}
