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

// Customers(): page component that renders customer list in a DataGrid and provides a simple search box.
export default function Customers() {

  // - customers: array where the fetched customer list is stored
  // - filter: text from the search box
  // - addOpen: whether the add-customer dialog is visible
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filter, setFilter] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  // fetchCustomers(): ask the API for the customer list and save it into state
  function fetchCustomers() {
    getCustomers()
      .then(data => setCustomers(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch customers', err))
  }

  // When the page loads, fetch the customers once. The empty [] means "run once".
  useEffect(() => { fetchCustomers() }, [])

    // rows: the data passed to the DataGrid. If the user typed something in the search box,
    // the code filters customers by joining relevant fields and doing a simple includes() check.
  const rows = filter.trim()
    ? customers.filter(c => [c.firstname, c.lastname, c.email, c.phone, c.streetaddress, c.postcode, c.city]
        .filter(Boolean).join(' ').toLowerCase().includes(filter.toLowerCase()))
    : customers

  // columns: describe which fields show up in the table and their labels
  const columns: any[] = [
    { field: 'firstname', headerName: 'First name', flex: 1, minWidth: 140 },
    { field: 'lastname', headerName: 'Last name', flex: 1, minWidth: 140 },
    { field: 'streetaddress', headerName: 'Address', flex: 1.4, minWidth: 180 },
    { field: 'postcode', headerName: 'Post code', width: 120 },
    { field: 'city', headerName: 'City', width: 140 },
    { field: 'email', headerName: 'Email', flex: 1.6, minWidth: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 }
  ]

  // append actions column with the Edit and Delete controls
  columns.push({
    field: 'actions', headerName: 'Actions', width: 140, sortable: false, filterable: false,
    renderCell: (params: any) => {
      const row = params.row as any
      return (
        <div style={{ display: 'flex', gap: 6 }}>
          <EditCustomer fetchCustomers={fetchCustomers} customerRow={row} />
          <IconButton size="small" onClick={() => {
            if (window.confirm('Delete this customer?')) {
              const target = (row as any)?._links?.self?.href ?? (row as any).id
              deleteCustomer(target).then(() => fetchCustomers())
            }
          }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      )
    }
  })

  return (
    <section className="page">
      <h2>Customers</h2>

      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Search box: updates `filter` state on change */}
        <TextField size="small" placeholder="Search" value={filter} onChange={e => setFilter(e.target.value)} />
        {/* Clear button: reset the search box */}
        <Button onClick={() => setFilter('')} variant="outlined" size="small">Clear</Button>
        <div style={{ flex: 1 }} />
        {/* Add customer button: open the dialog */}
        <Button variant="contained" size="small" onClick={() => setAddOpen(true)}>Add customer</Button>
        {/* The add dialog: when saved, reload the list from server */}
        <AddCustomer open={addOpen} onClose={() => setAddOpen(false)} onSaved={() => fetchCustomers()} />
      </div>


      <div style={{ height: 520, width: '120%' }}>
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
