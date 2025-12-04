import { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { getTrainingsWithCustomer } from '../api/trainingApi'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/Helsinki')

// parseLocalDate: Parse a date string in Helsinki timezone and return a Date object.
function parseLocalDate(raw: string) {
  const d = (dayjs as any).tz(raw)
  return d.toDate()
}

// trainingsToEvents: Convert training list to FullCalendar event objects with start/end times and customer names.
function trainingsToEvents(list: any[]) {
  return list.map(t => {
    const s = parseLocalDate(t.date)
    const dur = Number(t.duration || 60)
    const e = new Date(s.getTime())
    e.setMinutes(e.getMinutes() + dur)
    
    const cust = typeof t.customer === 'object'
      ? `${t.customer?.firstname ?? ''} ${t.customer?.lastname ?? ''}`.trim()
      : String(t.customer ?? '')
    
    return {
      id: t._links?.self?.href ?? t.id ?? String(Math.random()),
      title: `${t.activity}${cust ? ' / ' + cust : ''}`,
      start: s.toISOString(),
      end: e.toISOString(),
    }
  })
}

// CalendarPage: Render FullCalendar with trainings, listen for updates to refresh events.
export default function CalendarPage() {
  const calRef = useRef<any>(null)

  useEffect(() => {
    const handler = () => {
      calRef.current.getApi().refetchEvents()
    }
    globalThis.addEventListener('trainings:updated', handler)
    return () => globalThis.removeEventListener('trainings:updated', handler)
  }, [])

  return (
    <Box component="section" sx={{ maxWidth: 'none', width: '100%', px: 2 }}>
   
      <Typography variant="h5" gutterBottom>Calendar</Typography>
     
      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: 'today prev,next', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' }}
        allDaySlot={false}
        slotMinTime="07:00:00"
        events={async (_fetchInfo, successCallback) => {
          const list = await getTrainingsWithCustomer()
          successCallback(trainingsToEvents(list))
        }}
        height="auto"
        nowIndicator
      />
    </Box>
  )
}