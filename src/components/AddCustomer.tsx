import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import type { CustomerForm } from '../types/customer'
import { saveCustomer } from '../api/customerApi'


// - open: whether the dialog is visible
// - onClose: callback to close the dialog
// - onSaved: optional callback called after the server returns the new customer
type Props = {
	open: boolean
	onClose: () => void
	onSaved?: (created?: any) => void
}

export default function AddCustomer({ open, onClose, onSaved }: Props) {
		// Local state for each form field. useState('') creates a string state and a setter.
		// Each field stores what the user types so values can be sent to the server.
		const [firstname, setFirstname] = useState('')
	const [lastname, setLastname] = useState('')
	const [streetaddress, setStreetaddress] = useState('')
	const [postcode, setPostcode] = useState('')
	const [city, setCity] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')

	// reset(): clear all input fields back to empty strings
	function reset() {
		setFirstname('')
		setLastname('')
		setStreetaddress('')
		setPostcode('')
		setCity('')
		setEmail('')
		setPhone('')
	}

	// handleClose(): run when user cancels or the dialog is closed
	// Clears the form and call the onClose callback so the parent hides the dialog.
	function handleClose() {
		reset()
		onClose()
	}

	// handleSave(): build a simple object from form fields and POST it to the API.
	function handleSave() {
		const payload: CustomerForm = {
			firstname: firstname.trim(),
			lastname: lastname.trim(),
			streetaddress: streetaddress.trim() || undefined,
			postcode: postcode.trim() || undefined,
			city: city.trim() || undefined,
			email: email.trim() || undefined,
			phone: phone.trim() || undefined
		}
		saveCustomer(payload)
			.then((res) => {
				// after successful save: clear form, inform parent and close dialog
				reset()
				onSaved?.(res)
				onClose()
			})
			.catch(() => {
			})
	}

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Add customer</DialogTitle>
			<DialogContent>
				<div style={{ display: 'grid', gap: 12 }}>
					<TextField label="First name" value={firstname} onChange={e => setFirstname(e.target.value)} />
					<TextField label="Last name" value={lastname} onChange={e => setLastname(e.target.value)} />
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
