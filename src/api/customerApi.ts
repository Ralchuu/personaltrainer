import type { CustomerForm } from '../types/customer'

const BASE = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

// getCustomers: Fetch customers from the API.
export function getCustomers() {
  return fetch(`${BASE}/customers`)
    .then(r => r.json())
    .then(data => Array.isArray(data) ? data : data._embedded.customers)
}

// deleteCustomer: Delete a customer by URL or ID.
export function deleteCustomer(urlOrId: string | number) {
  const url = typeof urlOrId === 'number' ? `${BASE}/customers/${urlOrId}` : urlOrId
  return fetch(url, { method: 'DELETE' })
}

// getCustomer: Fetch a single customer by URL.
export function getCustomer(url: string) {
  return fetch(url).then(r => r.json())
}

// saveCustomer: POST a new customer to the API.
export function saveCustomer(newCustomer: CustomerForm) {
  return fetch(`${BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCustomer)
  }).then(r => r.json())
}

// updateCustomer: PUT updated customer to the API.
export function updateCustomer(url: string, updatedCustomer: CustomerForm) {
  return fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedCustomer)
  }).then(r => r.json())
}
