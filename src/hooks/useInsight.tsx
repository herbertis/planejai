import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIPrompt } from '@/data/aiPrompt'
import type { SimulationRecord } from '@/hooks/useSimulationStorage'
import { type AIInsight, fetchAIInsight } from '@/services/aiService'

type InsightState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: AIInsight }
  | { status: 'error'; message: string }

export function useInsight(record: SimulationRecord | null) {
  const [state, setState] = useState<InsightState>({ status: 'idle' })
  const calledRef = useRef(false)

  const fetchInsight = useCallback(() => {
    if (!record) return

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

    if (!apiKey) {
      setState({
        status: 'error',
        message:
          'Chave da API não configurada. Adicione VITE_GEMINI_API_KEY no arquivo .env',
      })
      return
    }

    setState({ status: 'loading' })

    const prompt = buildAIPrompt(record)

    fetchAIInsight(prompt, apiKey)
      .then((data) => setState({ status: 'success', data }))
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Erro desconhecido'
        setState({ status: 'error', message })
      })
  }, [record])

  useEffect(() => {
    if (!record || calledRef.current) {
      return
    }

    calledRef.current = true
    fetchInsight()
  }, [record, fetchInsight])

  const retry = () => {
    fetchInsight()
  }

  return { state, retry }
}
