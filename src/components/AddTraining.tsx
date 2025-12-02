import { useState } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { saveTraining } from '../api/trainingApi'

// AddTraining: small student-style component to add a training for one customer
export default function AddTraining({ fetchTrainings, customerRow }: any) {
  // local UI state
  const [open, setOpen] = useState(false)
  const [tempDate, setTempDate] = useState('') // chosen date, not yet confirmed
  const [date, setDate] = useState('') // confirmed date used when saving
  const [activity, setActivity] = useState('')
  const [duration, setDuration] = useState('')

  // open the dialog and reset fields
  const openDialog = () => {
    setTempDate(new Date().toISOString().slice(0, 16))
    setDate('')
    setActivity('')
    setDuration('')
    setOpen(true)
  }

  // save input to server 
  const save = () => {
    if (!date || !activity || !duration) return alert('Please fill date, activity and duration')
    const customer = customerRow?._links?.self?.href || customerRow?.id
    saveTraining({ date, activity, duration: Number(duration), customer: String(customer) })
      .then(() => { fetchTrainings(); setOpen(false) })
      .catch(() => {})
  }

  return (
    <>
      {/* trigger button to open dialog */}
      <IconButton size="small" onClick={openDialog}><AddIcon fontSize="small" /></IconButton>

      {/* dialog with simple inputs */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add training</DialogTitle>
        <DialogContent>
          <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* pick a datetime (temp) */}
              <TextField label="Date" type="datetime-local" value={tempDate} onChange={e => setTempDate(e.target.value)} fullWidth />
              {/* confirm chosen date before saving */}
              <Button size="small" onClick={() => setDate(tempDate)}>Set date</Button>
            </div>

            {/* activity and duration inputs */}
            <TextField label="Activity" value={activity} onChange={e => setActivity(e.target.value)} fullWidth />
            <TextField label="Duration (min)" type="number" value={duration} onChange={e => setDuration(e.target.value)} fullWidth />
          </div>
        </DialogContent>

        {/* cancel or save the training */}
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
