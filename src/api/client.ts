const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export async function apiFetch(path: string, options?: RequestInit) {
  const url = BASE ? `${BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}` : path
  const res = await fetch(url, options)

  // try to detect non-JSON responses (common when dev server returns index.html)
  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.toLowerCase().includes('application/json')

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '')
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${bodyText}`)
  }

  if (!isJson) {
    // If we unexpectedly got HTML (like index.html) offer a helpful hint.
    const text = await res.text().catch(() => '')
    const sample = text.slice(0, 300)
    throw new Error(
      `Expected JSON from ${url} but received content-type="${contentType}". Response snippet:\n${sample}\n\n` +
      `If you're running locally, ensure VITE_API_BASE_URL is set to the API base URL (see .env.example).`
    )
  }

  return res.json()
}

export default apiFetch
