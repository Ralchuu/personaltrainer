import { useEffect, useState } from 'react'
import { getCustomers, deleteCustomer } from '../api/customerApi'
import type { Customer } from '../types/customer'
import { DataGrid } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCustomer from '../components/AddCustomer'
import EditCustomer from '../components/EditCustomer'
import AddTraining from '../components/AddTraining'

// Customers(): page component that renders customer list in a DataGrid with search and CRUD operations.
export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filter, setFilter] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  // fetchCustomers(): load customers from API and update state.
  function fetchCustomers() {
    getCustomers().then(setCustomers)
  }

  useEffect(() => { fetchCustomers() }, [])

  const rows = filter.trim()
    ? customers.filter(c => [c.firstname, c.lastname, c.email, c.phone, c.streetaddress, c.postcode, c.city]
        .filter(Boolean).join(' ').toLowerCase().includes(filter.toLowerCase()))
    : customers

  const columns: any[] = [
    { field: 'firstname', headerName: 'First name', flex: 1, minWidth: 140 },
    { field: 'lastname', headerName: 'Last name', flex: 1, minWidth: 140 },
    { field: 'streetaddress', headerName: 'Address', flex: 1.4, minWidth: 180 },
    { field: 'postcode', headerName: 'Post code', width: 120 },
    { field: 'city', headerName: 'City', width: 140 },
    { field: 'email', headerName: 'Email', flex: 1.6, minWidth: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 }
  ]

  // append actions column with Edit and Delete controls
  columns.push({
    field: 'actions', headerName: 'Actions', width: 120, sortable: false, filterable: false,
    renderCell: (params: any) => (
      <div style={{ display: 'flex', gap: 6 }}>
        <EditCustomer fetchCustomers={fetchCustomers} customerRow={params.row} />
        <IconButton size="small" onClick={() => {
          if (window.confirm('Delete this customer?')) {
            deleteCustomer(params.row._links.self.href).then(() => fetchCustomers())
          }
        }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    )
  })

  columns.push({
    field: 'addtraining', headerName: 'Add training', width: 120, sortable: false, filterable: false,
    renderCell: (params: any) => <AddTraining fetchTrainings={() => {}} customerRow={params.row} />
  })

  return (
    <section className="page">
      <h2>Customers</h2>

      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <TextField size="small" placeholder="Search" value={filter} onChange={e => setFilter(e.target.value)} />
        <Button onClick={() => setFilter('')} variant="outlined" size="small">Clear</Button>
        <Button onClick={() => {
          const header = 'First name,Last name,Address,Post code,City,Email,Phone'
          const lines = rows.map(r => [r.firstname, r.lastname, r.streetaddress, r.postcode, r.city, r.email, r.phone].join(','))
          const csv = [header, ...lines].join('\n')
          const blob = new Blob([csv], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'customers.csv'
          a.click()
          URL.revokeObjectURL(url)
        }} variant="outlined" size="small">Export CSV</Button>
        <div style={{ flex: 1 }} />
        <Button variant="contained" size="small" onClick={() => setAddOpen(true)}>Add customer</Button>
        <AddCustomer open={addOpen} onClose={() => setAddOpen(false)} onSaved={() => fetchCustomers()} />
      </div>


      <div style={{ height: 520, width: '140%' }}>
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
