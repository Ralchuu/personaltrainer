import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { getTrainings } from '../api/personaltrainer.api'
import type { Training } from '../types'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'

export default function Trainings() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
 
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const list: Training[] = await getTrainings()
        if (mounted) setTrainings(list)
      } catch (e: any) {
        setError(String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  

  const getCustomerName = (t: Training) => (t.customer ? `${t.customer.firstname ?? ''} ${t.customer.lastname ?? ''}`.trim() : '')

  const displayed = useMemo(() => {
    const q = filter.trim().toLowerCase()
    return trainings
      .map((t, i) => ({ id: t._links?.self?.href ?? `tr-${i}`, ...t, customerName: getCustomerName(t) }))
      .filter(t => {
        if (!q) return true
        const hay = [t.activity, t.customerName].filter(Boolean).join(' ').toLowerCase()
        return hay.includes(q)
      })
  }, [trainings, filter])

  const formatDate = (d?: string) => d ? dayjs(d).format('DD.MM.YYYY HH:mm') : '-'

  const columns: GridColDef[] = [
     { field: 'date', headerName: 'Date', flex: 1, minWidth: 180, renderCell: (params: any) => formatDate(params?.row?.date ?? params?.value) },
     { field: 'activity', headerName: 'Activity', flex: 1.6, minWidth: 200 },
     { field: 'duration', headerName: 'Duration', flex: 0.6, minWidth: 100 },
     { field: 'customerName', headerName: 'Customer', flex: 1.6, minWidth: 200 }
  ]

  return (
    <section className="page">
      <h2>Trainings</h2>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
  <TextField size="small" placeholder="Search" value={filter} onChange={e => setFilter(e.target.value)} />
        <button onClick={() => setFilter('')}>Clear</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <div style={{ height: 520, width: '100%' }}>
        <DataGrid rows={displayed} columns={columns} autoPageSize disableRowSelectionOnClick />
      </div>
    </section>
  )
}
