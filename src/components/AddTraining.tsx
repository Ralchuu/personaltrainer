import { useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { saveTraining } from '../api/trainingApi'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/Helsinki')

// AddTraining: Dialog to add a training for a customer.
export default function AddTraining({ fetchTrainings, customerRow }: any) {
  const [open, setOpen] = useState(false)
  const [tempDate, setTempDate] = useState('')
  const [date, setDate] = useState('')
  const [activity, setActivity] = useState('')
  const [duration, setDuration] = useState('')

  const openDialog = () => {
    setTempDate(dayjs().tz('Europe/Helsinki').format('YYYY-MM-DDTHH:mm'))
    setDate('')
    setActivity('')
    setDuration('')
    setOpen(true)
  }

  const save = () => {
    if (!date.trim() || !activity.trim() || !duration.trim()) {
      alert('Date, activity, and duration are required')
      return
    }
    const customer = customerRow._links.self.href
    const isoDate = dayjs.tz(date, 'Europe/Helsinki').toISOString()
    saveTraining({ date: isoDate, activity, duration: Number(duration), customer })
      .then(() => {
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
