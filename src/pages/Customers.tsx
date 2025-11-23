import { useEffect, useMemo, useState } from 'react'

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'

type Customer = {
  id?: number
  firstname?: string
  lastname?: string
  email?: string
  phone?: string
  _links?: any
}

function getName(c: Customer) {
  return `${c.firstname ?? ''} ${c.lastname ?? ''}`.trim() || 'Unknown'
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [sortKey, setSortKey] = useState<'id' | 'name' | 'email' | 'phone'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`${BASE}/customers`)
      .then((res) => res.json())
      .then((data) => {
        const list: Customer[] = data?._embedded?.customers ?? data?.customers ?? (Array.isArray(data) ? data : [])
        const normalized = list.map((c) => {
          if (!c.id && c._links?.self?.href) {
            const m = String(c._links.self.href).match(/\/(\d+)(?:$|\/)/)
            if (m) c.id = Number(m[1])
          }
          return c
        })
        setCustomers(normalized)
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    return customers.filter((c) => {
      if (!q) return true
      return getName(c).toLowerCase().includes(q) || (c.email ?? '').toLowerCase().includes(q) || (c.phone ?? '').toLowerCase().includes(q)
    })
  }, [customers, filter])

  const sorted = useMemo(() => {
    const s = [...filtered]
    s.sort((a, b) => {
      let va: string | number = ''
      let vb: string | number = ''
      switch (sortKey) {
        case 'id':
          va = a.id ?? 0; vb = b.id ?? 0; break
        case 'name':
          va = getName(a).toLowerCase(); vb = getName(b).toLowerCase(); break
        case 'email':
          va = (a.email ?? '').toLowerCase(); vb = (b.email ?? '').toLowerCase(); break
        case 'phone':
          va = (a.phone ?? '').toLowerCase(); vb = (b.phone ?? '').toLowerCase(); break
      }
      if (va < vb) return sortOrder === 'asc' ? -1 : 1
      if (va > vb) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return s
  }, [filtered, sortKey, sortOrder])

  const onSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortOrder((o) => o === 'asc' ? 'desc' : 'asc')
    else setSortKey(key)
  }

  return (
    <section className="page">
      <h2>Customers</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Search by name, email or phone" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <button onClick={() => setFilter('')} style={{ marginLeft: 8 }}>Clear</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => onSort('id')}>ID</th>
            <th onClick={() => onSort('name')}>Name</th>
            <th onClick={() => onSort('email')}>Email</th>
            <th onClick={() => onSort('phone')}>Phone</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && !loading && <tr><td colSpan={4}>No customers found</td></tr>}
          {sorted.map((c) => (
            <tr key={c.id ?? `${c.email ?? ''}-${c.phone ?? ''}`}>
              <td>{c.id ?? '-'}</td>
              <td>{getName(c)}</td>
              <td>{c.email ?? '-'}</td>
              <td>{c.phone ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
