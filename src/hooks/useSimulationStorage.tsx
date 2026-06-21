import { type SimulationFormData } from '@/data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

export type SimulationRecord = SimulationFormData & { id: string }

export const useSimulationStorage = () => {
  const saveFormData = (formData: SimulationFormData): string => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = { ...formData, id }

    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const savedData = storage
      ? (JSON.parse(storage) as SimulationRecord[])
      : []

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record]),
    )

    return id
  }

  const getFormData = (id: string): SimulationRecord | null => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!storage) {
      return null
    }

    const savedData = JSON.parse(storage) as SimulationRecord[]
    return savedData.find((record) => record.id === id) ?? null
  }

  const getAllFormData = (): SimulationRecord[] => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!storage) {
      return []
    }
    return JSON.parse(storage) as SimulationRecord[]
  }

  return { saveFormData, getFormData, getAllFormData }
}
