import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import type { CustomerForm } from '../types/customer'
import { saveCustomer } from '../api/customerApi'


type Props = {
	open: boolean
	onClose: () => void
	onSaved?: (created?: any) => void
}

export default function AddCustomer({ open, onClose, onSaved }: Props) {
	const [firstname, setFirstname] = useState('')
	const [lastname, setLastname] = useState('')
	const [streetaddress, setStreetaddress] = useState('')
	const [postcode, setPostcode] = useState('')
	const [city, setCity] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')

	function reset() {
		setFirstname('')
		setLastname('')
		setStreetaddress('')
		setPostcode('')
		setCity('')
		setEmail('')
		setPhone('')
	}

	// handleClose(): close dialog and reset form.
	function handleClose() {
		reset()
		onClose()
	}

	// handleSave(): send form data to API and close dialog.
	function handleSave() {
		const payload: CustomerForm = {
			firstname,
			lastname,
			streetaddress,
			postcode,
			city,
			email,
			phone
		}
		saveCustomer(payload).then(() => {
			reset()
			onSaved?.()
			onClose()
		})
	}

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Add customer</DialogTitle>
			<DialogContent>
				<div style={{ display: 'grid', gap: 12 }}>
					<TextField required label="First name" value={firstname} onChange={e => setFirstname(e.target.value)} />
					<TextField required label="Last name" value={lastname} onChange={e => setLastname(e.target.value)} />
					<TextField label="Street address" value={streetaddress} onChange={e => setStreetaddress(e.target.value)} />
					<TextField label="Post code" value={postcode} onChange={e => setPostcode(e.target.value)} />
					<TextField label="City" value={city} onChange={e => setCity(e.target.value)} />
					<TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} />
					<TextField label="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleSave} variant="contained">Save</Button>
			</DialogActions>
		</Dialog>
	)
}
