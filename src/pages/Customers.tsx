import { useEffect, useMemo, useState } from 'react'
import { getCustomers } from '../api/personaltrainer.api'
import type { Customer } from '../types'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = () => {
    setLoading(true)
    getCustomers()
      .then((data) => setCustomers(Array.isArray(data) ? data : (data ?? [])))
      .catch(err => setError(String(err)))
      .finally(() => setLoading(false))
  }

  const rows = useMemo(() => {
    const q = filter.trim().toLowerCase()
    return customers
      .map((c, i) => ({ id: c._links?.self?.href ?? `c-${i}`, ...c }))
      .filter(r => {
        if (!q) return true
        const hay = [r.firstname, r.lastname, r.email, r.phone, r.streetaddress, r.postcode, r.city]
          .filter(Boolean).join(' ').toLowerCase()
        return hay.includes(q)
      })
  }, [customers, filter])

  const columns: GridColDef[] = [
    { field: 'firstname', headerName: 'First name', flex: 0.9, minWidth: 150 },
    { field: 'lastname', headerName: 'Last name', flex: 0.9, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1.6, minWidth: 220 },
    { field: 'phone', headerName: 'Phone', flex: 0.6, minWidth: 130 },
    { field: 'streetaddress', headerName: 'Address', flex: 1.6, minWidth: 220 },
    { field: 'postcode', headerName: 'Postcode', flex: 0.5, minWidth: 100 },
    { field: 'city', headerName: 'City', flex: 0.7, minWidth: 120 }
  ]

  return (
    <section className="page">
      <h2>Customers</h2>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
  <TextField size="small" placeholder="Search" value={filter} onChange={e => setFilter(e.target.value)} />
        <button onClick={() => setFilter('')}>Clear</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <div style={{ height: 520, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} autoPageSize disableRowSelectionOnClick />
      </div>
    </section>
  )
}
