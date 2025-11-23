import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'

type SimpleCustomer = {
  id?: number
  firstname?: string
  lastname?: string
}

type Training = {
  id?: number
  date?: string
  activity?: string
  duration?: number | string
  customer?: SimpleCustomer
  _links?: any
}

export default function Trainings() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [sortKey, setSortKey] = useState<'date' | 'activity' | 'duration'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`${BASE}/gettrainings`)
      .then((res) => res.json())
      .then((data) => {
        const list: Training[] = Array.isArray(data) ? data : data?._embedded?.trainings ?? []
        setTrainings(list)
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    return trainings.filter((t) => {
      if (!q) return true
      const activity = (t.activity ?? '').toLowerCase()
      const cname = t.customer ? `${t.customer.firstname ?? ''} ${t.customer.lastname ?? ''}`.toLowerCase() : ''
      return activity.includes(q) || cname.includes(q)
    })
  }, [trainings, filter])

  const sorted = useMemo(() => {
    const s = [...filtered]
    s.sort((a, b) => {
      if (sortKey === 'date') {
        const da = new Date(a.date ?? '')
        const db = new Date(b.date ?? '')
        return sortOrder === 'asc' ? +da - +db : +db - +da
      }
      const va = String(a[sortKey] ?? '').toLowerCase()
      const vb = String(b[sortKey] ?? '').toLowerCase()
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

  const formatDate = (d?: string) => d ? dayjs(d).format('DD.MM.YYYY HH:mm') : '-'

  return (
    <section className="page">
      <h2>Trainings</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Filter by activity or customer" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <button onClick={() => setFilter('')} style={{ marginLeft: 8 }}>Clear</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => onSort('date')}>Date</th>
            <th onClick={() => onSort('activity')}>Activity</th>
            <th onClick={() => onSort('duration')}>Duration</th>
            <th>Customer</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && !loading && <tr><td colSpan={4}>No trainings found</td></tr>}
          {sorted.map((t, i) => (
            <tr key={t.id ?? i}>
              <td>{formatDate(t.date)}</td>
              <td>{t.activity ?? '-'}</td>
              <td>{t.duration ?? '-'}{typeof t.duration === 'number' ? ' min' : ''}</td>
              <td>{t.customer ? `${t.customer.firstname ?? ''} ${t.customer.lastname ?? ''}`.trim() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
