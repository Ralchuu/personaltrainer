import { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { getTrainingsWithCustomer } from '../api/trainingApi'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


function parseLocalDate(raw: any) {
  if (!raw) return null
  const [datePart, timePart] = String(raw).split('T')
  const [y, mo, d] = (datePart || '').split('-').map(Number)
  // If backend returned only a date (no time), return local midnight
  if (!timePart) return new Date(y, mo - 1, d)
  // Otherwise extract hour and minute and ignore any timezone suffix
  const [h, minPart] = (timePart || '').split(':')
  const min = (minPart || '').split(/[Z+-]/)[0]
  return new Date(y, mo - 1, d, Number(h || 0), Number(min || 0))
}

// trainingsToEvents(list)

function trainingsToEvents(list: any) {
  const out: any[] = []
  for (const t of list || []) {
    const s = parseLocalDate(t.date)
    if (!s) continue
    const dur = Number(t.duration || 60)
    const e = new Date(s.getTime())
    e.setMinutes(e.getMinutes() + dur)
    const cust = t.customer && t.customer.firstname ? `${t.customer.firstname} ${t.customer.lastname || ''}`.trim() : (t.customer || '')
    out.push({
      id: (t && t._links && t._links.self && t._links.self.href) || (t && t.id) || '',
      title: `${t.activity}${cust ? ' / ' + cust : ''}`,
      start: s.toISOString(),
      end: e.toISOString(),
    })
  }
  return out
}

export default function CalendarPage() {
  const calRef = useRef<any>(null)

  useEffect(() => {
    const handler = () => {
      if (calRef.current && calRef.current.getApi) {
        calRef.current.getApi().refetchEvents()
      }
    }
    window.addEventListener('trainings:updated', handler)
    return () => window.removeEventListener('trainings:updated', handler)
  }, [])

  return (
    <Box component="section" sx={{ maxWidth: 'none', width: '100%', px: 2 }}>
      {/* Page heading */}
      <Typography variant="h5" gutterBottom>Calendar</Typography>
      {/* FullCalendar instance: configured to show a time-grid week view */}
      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: 'today prev,next', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' }}
        allDaySlot={false}
        slotMinTime="07:00:00"
        events={async (_fetchInfo, successCallback, failureCallback) => {
          try {
            const list = await getTrainingsWithCustomer()
            const ev = Array.isArray(list) ? trainingsToEvents(list) : []
            successCallback(ev)
          } catch (err) {
            const e = err instanceof Error ? err : new Error(String(err) || 'Failed to load trainings')
            failureCallback(e)
          }
        }}
        height="auto"
        nowIndicator
      />
    </Box>
  )
}
