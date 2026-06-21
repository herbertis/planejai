export interface AIInsight {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  tips: Array<{
    title: string
    content: string
  }>
}

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const MAX_RETRIES = 3
const INITIAL_DELAY_MS = 3000

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getUserFriendlyError(status: number): string {
  switch (status) {
    case 429:
      return 'Limite de requisições atingido. Aguarde alguns instantes e tente novamente.'
    case 400:
      return 'Requisição inválida para a API. Verifique os dados da simulação.'
    case 401:
    case 403:
      return 'Chave de API inválida ou sem permissão. Verifique o arquivo .env.'
    case 500:
    case 503:
      return 'Serviço do Gemini temporariamente indisponível. Tente novamente em breve.'
    default:
      return `Erro na API (${status}). Tente novamente.`
  }
}

export async function fetchAIInsight(
  prompt: string,
  apiKey: string,
): Promise<AIInsight> {
  let lastError: Error = new Error('Erro desconhecido')

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      // Backoff exponencial: 3s, 9s, 27s
      const waitMs = INITIAL_DELAY_MS * Math.pow(3, attempt - 1)
      await delay(waitMs)
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    })

    // Rate limit — tenta novamente com backoff
    if (response.status === 429) {
      lastError = new Error(getUserFriendlyError(429))
      continue
    }

    // Erros não recuperáveis — falha imediata
    if (!response.ok) {
      throw new Error(getUserFriendlyError(response.status))
    }

    const data = (await response.json()) as {
      candidates: Array<{
        content: { parts: Array<{ text: string }> }
      }>
    }

    const text = data.candidates[0]?.content?.parts[0]?.text

    if (!text) {
      throw new Error('Resposta inválida da API. Tente novamente.')
    }

    return JSON.parse(text) as AIInsight
  }

  throw lastError
}
