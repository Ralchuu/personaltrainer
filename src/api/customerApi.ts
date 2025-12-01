import type { CustomerForm } from '../types/customer'

const BASE = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

// getCustomers(): Fetches customers from the API base and returns an array.
export function getCustomers() {
  return fetch(`${BASE}/customers`)
    .then(response => {
      if (!response.ok) throw new Error('Error when fetching customers: ' + response.statusText)
      return response.json()
    })
    .then(data => {
      if (Array.isArray(data)) return data
      if (data && typeof data === 'object' && data._embedded && Array.isArray(data._embedded.customers)) return data._embedded.customers
      return data
    })
}

// deleteCustomer: Delete a customer by numeric id or by full resource URL. Resolves to null on success.
export function deleteCustomer(urlOrId: string | number) {
  const url = typeof urlOrId === 'number' ? `${BASE}/customers/${urlOrId}` : String(urlOrId)
  return fetch(url, { method: 'DELETE' }).then(res => {
    if (!res.ok) throw new Error('Error when deleting customer: ' + res.statusText)
    return null
  })
}

// getCustomer: Fetch a single customer resource by its URL and return the parsed JSON object.
export function getCustomer(url: string) {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error('Error when fetching customer: ' + res.statusText)
    return res.json()
  })
}

// saveCustomer: POST a new customer to the API and return the created resource.
export function saveCustomer(newCustomer: CustomerForm) {
  return fetch(`${BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCustomer)
  }).then(res => {
    if (!res.ok) throw new Error('Error when adding a new customer')
    return res.json()
  })
}

// updateCustomer: PUT updatedCustomer to the resource URL and return the updated object.
export function updateCustomer(url: string, updatedCustomer: CustomerForm) {
  return fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedCustomer)
  }).then(res => {
    if (!res.ok) throw new Error('Error when updating customer: ' + res.statusText)
    return res.json()
  })
}
