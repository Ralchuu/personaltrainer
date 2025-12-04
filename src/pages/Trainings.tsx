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
    getTrainingsWithCustomer().then(setTrainings)
  }

  const rows = filter.trim()
    ? trainings.filter(t => {
      const customerName = typeof t.customer === 'object' ? `${t.customer?.firstname ?? ''} ${t.customer?.lastname ?? ''}`.trim() : String(t.customer ?? '')
      return [t.activity, customerName].filter(Boolean).join(' ').toLowerCase().includes(filter.toLowerCase())
    })
    : trainings

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 180, renderCell: (params: any) => dayjs(params.value).format('DD.MM.YYYY HH:mm') },
    { field: 'activity', headerName: 'Activity', flex: 1, minWidth: 160 },
    { field: 'duration', headerName: 'Duration (min)', width: 140 },
    {
      field: 'customer', headerName: 'Customer', flex: 1, minWidth: 160, renderCell: (params: any) => {
        const c = params.row.customer
        return typeof c === 'string' ? c : `${c?.firstname ?? ''} ${c?.lastname ?? ''}`.trim()
      }
    }
  ]

  columns.push({
    field: 'actions', headerName: 'Actions', width: 100, sortable: false, filterable: false,
    renderCell: (params: any) => (
      <IconButton size="small" onClick={() => {
        if (window.confirm('Delete this training?')) {
          deleteTraining(params.row._links.self.href).then(() => { fetchTrainings(); window.dispatchEvent(new CustomEvent('trainings:updated')) })
        }
      }}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    )
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
