import { useState } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import type { Customer, CustomerForm } from '../types/customer'
import { updateCustomer } from '../api/customerApi'

type EditCustomerProps = {
  fetchCustomers: () => void
  customerRow: Customer
}

export default function EditCustomer({ fetchCustomers, customerRow }: EditCustomerProps) {
  const [open, setOpen] = useState(false)
  const [customer, setCustomer] = useState<CustomerForm>({
    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: ''
  })

  const handleClickOpen = () => {
    setOpen(true)
    setCustomer({
      firstname: customerRow.firstname || '',
      lastname: customerRow.lastname || '',
      streetaddress: customerRow.streetaddress || '',
      postcode: customerRow.postcode || '',
      city: customerRow.city || '',
      email: customerRow.email || '',
      phone: customerRow.phone || ''
    })
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    updateCustomer((customerRow as any)._links.self.href, customer).then(() => {
      fetchCustomers()
      handleClose()
    })
  }

  return (
    <>
      <IconButton size="small" onClick={handleClickOpen}>
        <EditIcon fontSize="small" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            required
            label="First name"
            value={customer.firstname}
            onChange={e => setCustomer({ ...customer, firstname: e.target.value })}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            required
            label="Last name"
            value={customer.lastname}
            onChange={e => setCustomer({ ...customer, lastname: e.target.value })}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Street address"
            value={customer.streetaddress}
            onChange={e => setCustomer({ ...customer, streetaddress: e.target.value })}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Post code"
            value={customer.postcode}
            onChange={e => setCustomer({ ...customer, postcode: e.target.value })}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="City"
            value={customer.city}
            onChange={e => setCustomer({ ...customer, city: e.target.value })}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Email"
            value={customer.email}
            onChange={e => setCustomer({ ...customer, email: e.target.value })}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Phone"
            value={customer.phone}
            onChange={e => setCustomer({ ...customer, phone: e.target.value })}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
