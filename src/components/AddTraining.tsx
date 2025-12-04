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

// AddTraining: Dialog to add a training for a customer.
export default function AddTraining({ fetchTrainings, customerRow }: any) {
  const [open, setOpen] = useState(false)
  const [tempDate, setTempDate] = useState('')
  const [date, setDate] = useState('')
  const [activity, setActivity] = useState('')
  const [duration, setDuration] = useState('')

  const openDialog = () => {
    const local = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    }
    setTempDate(local(new Date()))
    setDate('')
    setActivity('')
    setDuration('')
    setOpen(true)
  }

  const save = () => {
    const customer = customerRow._links.self.href || customerRow.id
    saveTraining({ date, activity, duration: Number(duration), customer: String(customer) })
      .then((created) => {
        window.dispatchEvent(new CustomEvent('trainings:updated', { detail: created }))
        fetchTrainings()
        setOpen(false)
      })
  }

  return (
    <>
      <IconButton size="small" onClick={openDialog}><AddIcon fontSize="small" /></IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add training</DialogTitle>
        <DialogContent>
          <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <TextField label="Date" type="datetime-local" value={tempDate} onChange={e => setTempDate(e.target.value)} fullWidth />
              <Button size="small" onClick={() => setDate(tempDate)}>Set date</Button>
            </div>
            <TextField label="Activity" value={activity} onChange={e => setActivity(e.target.value)} fullWidth />
            <TextField label="Duration (min)" type="number" value={duration} onChange={e => setDuration(e.target.value)} fullWidth />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
