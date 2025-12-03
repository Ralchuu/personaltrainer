import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { getTrainingsWithCustomer, deleteTraining } from '../api/trainingApi'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Training } from '../types/training'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'

// Trainings(): page component that renders trainings in a DataGrid, formats dates, and shows customer names.
export default function Trainings() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => { fetchTrainings() }, [])

  // fetchTrainings(): load trainings and put them into state.
  function fetchTrainings() {
    getTrainingsWithCustomer()
      .then(list => setTrainings(Array.isArray(list) ? list : []))
      .catch(() => {})
  }

  const rows = filter.trim()
    ? trainings.filter(t => {
        const customerName = typeof t.customer === 'object' ? `${t.customer?.firstname ?? ''} ${t.customer?.lastname ?? ''}`.trim() : String(t.customer ?? '')
        return [t.activity, customerName].filter(Boolean).join(' ').toLowerCase().includes(filter.toLowerCase())
      })
    : trainings

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 180, renderCell: (params: any) => dayjs(params.value ?? params.row.date).format('DD.MM.YYYY HH:mm') },
    { field: 'activity', headerName: 'Activity', flex: 1, minWidth: 160 },
    { field: 'duration', headerName: 'Duration (min)', width: 140 },
    { field: 'customer', headerName: 'Customer', flex: 1, minWidth: 160, renderCell: (params: any) => {
        const c = params.row.customer
        if (!c) return ''
        return typeof c === 'string' ? c : `${c.firstname ?? ''} ${c.lastname ?? ''}`.trim()
      } }
  ]

  // add actions column with delete button
  columns.push({
    field: 'actions', headerName: 'Actions', width: 100, sortable: false, filterable: false,
    renderCell: (params: any) => {
      const row = params.row as any
      return (
        <IconButton size="small" onClick={() => {
          if (window.confirm('Delete this training?')) {
            const target = row?._links?.self?.href ?? row?.id
            deleteTraining(target).then(() => { fetchTrainings(); window.dispatchEvent(new CustomEvent('trainings:updated')) }).catch(() => {})
          }
        }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      )
    }
  })

  return (
    <section className="page">
      <h2>Trainings</h2>

      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <TextField size="small" placeholder="Search" value={filter} onChange={e => setFilter(e.target.value)} />
        <button onClick={() => setFilter('')}>Clear</button>
      </div>


      <div style={{ height: 520, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={row => (row as any)._links?.self?.href ?? (row as any).id}
          autoPageSize
          disableRowSelectionOnClick
          disableColumnMenu
        />
      </div>
    </section>
  )
}
