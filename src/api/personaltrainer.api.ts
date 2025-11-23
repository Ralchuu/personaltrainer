const API = import.meta.env.VITE_API_BASE_URL ?? 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'

export function getCustomers() {
  return fetch(API + '/customers')
    .then(response => {
      if (!response.ok) throw new Error('Error when fetching customers: ' + response.statusText)
      return response.json()
    })
    .then(data => data?._embedded?.customers ?? data)
}

export function getTrainings() {
  return fetch(API + '/gettrainings')
    .then(response => {
      if (!response.ok) throw new Error('Error when fetching trainings: ' + response.statusText)
      return response.json()
    })
    .then(data => Array.isArray(data) ? data : data?._embedded?.trainings ?? [])

}
