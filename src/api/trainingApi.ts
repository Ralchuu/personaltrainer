import type { TrainingForm } from '../types/training'

const BASE = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export function getTrainings() {
  return fetch(`${BASE}/trainings`).then(response => {
    if (!response.ok) throw new Error('Error when fetching trainings: ' + response.statusText)
    return response.json()
  })
}

export function getTrainingsWithCustomer() {
  return fetch(`${BASE}/gettrainings`).then(response => {
    if (!response.ok) throw new Error('Error when fetching trainings with customer info: ' + response.statusText)
    return response.json()
  })
}

export function deleteTraining(urlOrId: string | number) {
  const url = typeof urlOrId === 'number' ? `${BASE}/trainings/${urlOrId}` : String(urlOrId)
  return fetch(url, { method: 'DELETE' }).then(response => {
    if (!response.ok) throw new Error('Error when deleting training: ' + response.statusText)
    return null
  })
}

export function saveTraining(newTraining: TrainingForm) {
  return fetch(`${BASE}/trainings`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newTraining)
  }).then(response => {
    if (!response.ok) throw new Error('Error when adding a new training')
    return response.json()
  })
}
