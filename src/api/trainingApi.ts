import type { TrainingForm } from '../types/training'

const BASE = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

// getTrainings: Fetch trainings from the API.
export function getTrainings() {
  return fetch(`${BASE}/trainings`).then(r => r.json())
}

// getTrainingsWithCustomer: Fetch trainings with customer information.
export function getTrainingsWithCustomer() {
  return fetch(`${BASE}/gettrainings`).then(r => r.json())
}

// deleteTraining: Delete a training by URL or ID.
export function deleteTraining(urlOrId: string | number) {
  const url = typeof urlOrId === 'number' ? `${BASE}/trainings/${urlOrId}` : urlOrId
  return fetch(url, { method: 'DELETE' })
}

// saveTraining: POST a new training to the API.
export function saveTraining(newTraining: TrainingForm) {
  return fetch(`${BASE}/trainings`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newTraining)
  }).then(r => r.json())
}
