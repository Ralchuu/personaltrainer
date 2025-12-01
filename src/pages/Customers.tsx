import { useEffect, useState } from 'react'
import { getCustomers } from '../api/customerApi'
import type { Customer } from '../types/customer'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'

// Customers(): page component that renders customer list in a DataGrid and provides a simple search box.
export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filter, setFilter] = useState('')

  // fetchCustomers(): load customers into state using getCustomers()
  function fetchCustomers() {
    getCustomers()
      .then(data => setCustomers(Array.isArray(data) ? data : []))
      .catch(() => {})
  }

  useEffect(() => { fetchCustomers() }, [])

  const rows = filter.trim()
    ? customers.filter(c => [c.firstname, c.lastname, c.email, c.phone, c.streetaddress, c.postcode, c.city]
        .filter(Boolean).join(' ').toLowerCase().includes(filter.toLowerCase()))
    : customers

  const columns: GridColDef[] = [
    { field: 'firstname', headerName: 'First name', flex: 1, minWidth: 140 },
    { field: 'lastname', headerName: 'Last name', flex: 1, minWidth: 140 },
    { field: 'streetaddress', headerName: 'Address', flex: 1.4, minWidth: 180 },
    { field: 'postcode', headerName: 'Post code', width: 120 },
    { field: 'city', headerName: 'City', width: 140 },
    { field: 'email', headerName: 'Email', flex: 1.6, minWidth: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 }
  ]

  return (
    <section className="page">
      <h2>Customers</h2>

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
