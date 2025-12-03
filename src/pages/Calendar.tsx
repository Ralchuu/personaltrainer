import { useEffect, useState, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { getTrainingsWithCustomer } from '../api/trainingApi'
import type { Training } from '../types/training'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

// Convert training records from the API into FullCalendar event objects
function trainingsToEvents(list: Training[]) {
  const out: Array<{ id: string; title: string; start: string; end: string }> = []
  for (const t of list) {
    // parse the training date and skip invalid values
    const d = new Date(String(t.date ?? ''))
    if (isNaN(d.getTime())) continue
    // compute end time by adding duration (minutes)
    const duration = Number(t.duration || 60)
    const end = new Date(d.getTime())
    end.setMinutes(end.getMinutes() + duration)
    // build a simple customer name string if present (guard null)
    let cust = ''
    if (t.customer != null && typeof t.customer === 'object') {
      const first = (t.customer as any).firstname ?? ''
      const last = (t.customer as any).lastname ?? ''
      cust = `${first} ${last}`.trim()
    } else {
      cust = String(t.customer ?? '')
    }
    out.push({
      id: (t as any)?._links?.self?.href ?? String((t as any).id ?? ''),
      // title contains activity and optional customer name separated by ' / '
      title: `${t.activity}${cust ? ' / ' + cust : ''}`,
      start: d.toISOString(),
      end: end.toISOString(),
    })
  }
  return out
}

export default function CalendarPage() {
  // trainings fetched from the API
  const [trainings, setTrainings] = useState<Training[]>([])
  // current selected view (month/week/day)
  const [view, setView] = useState<'dayGridMonth' | 'dayGridWeek' | 'dayGridDay'>('dayGridWeek')
    // title showing the current visible date range
  const [title, setTitle] = useState('')
  // ref to the FullCalendar instance for imperative calls
  const calRef = useRef<any>(null)

  // load trainings once when component mounts
  useEffect(() => { getTrainingsWithCustomer().then(list => setTrainings(Array.isArray(list) ? list : [])).catch(() => {}) }, [])

  // convert trainings to calendar events
  const events = trainingsToEvents(trainings)

  // navigation helpers: today / prev / next
  const go = (cmd: 'today' | 'prev' | 'next') => calRef.current?.getApi?.()?.[cmd]()
  const changeView = (v: typeof view) => { setView(v); calRef.current?.getApi?.()?.changeView(v) }

  // format the visible range into a short title string
  const formatHeader = (info: any) => {
    const start: Date = info.start
    const end: Date = new Date(info.end)
    end.setDate(end.getDate() - 1) 
    const mid = new Date((start.getTime() + end.getTime()) / 2)
    const viewType = info.view.type

    if (viewType === 'dayGridMonth') return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(mid)
    if (viewType === 'dayGridDay') return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(mid)

    // week view: try to show for example "December 15 – 21, 2025" or "Dec 29 – Jan 4, 2025"
    if (viewType === 'dayGridWeek') {
      const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
      if (sameMonth) return `${new Intl.DateTimeFormat('en', { month: 'long' }).format(start)} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`
      const sameYear = start.getFullYear() === end.getFullYear()
      if (sameYear) return `${new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(start)} – ${new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(end)}, ${start.getFullYear()}`
      return `${new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(start)} – ${new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(end)}`
    }

    return info.view.title || ''
  }

  // class name used to tweak styling per view
  const viewClass = view === 'dayGridDay' ? 'calendar-view-day' : view === 'dayGridWeek' ? 'calendar-view-week' : 'calendar-view-month'

  return (
    <Box component="section" className={`page ${viewClass}`} sx={{ maxWidth: 'none', width: '100%', px: 2 }}>
      <Typography variant="h5" gutterBottom>Calendar</Typography>

      {/* top controls: navigation buttons, centered title, and view toggles */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" onClick={() => go('today')}>Today</Button>
          <Button size="small" onClick={() => go('prev')}>Back</Button>
          <Button size="small" onClick={() => go('next')}>Next</Button>
        </Box>

        <Typography variant="subtitle1" sx={{ flex: 1, textAlign: 'center' }}>{title}</Typography>

        {/* choose Month / Week / Day view */}
        <ToggleButtonGroup value={view} exclusive onChange={(_, v) => v && changeView(v as any)}>
          <ToggleButton value="dayGridMonth">Month</ToggleButton>
          <ToggleButton value="dayGridWeek">Week</ToggleButton>
          <ToggleButton value="dayGridDay">Day</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* FullCalendar instance */}
      <FullCalendar
        key={view}
        ref={calRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView={view}
        headerToolbar={false}
        events={events}
        eventContent={(arg) => {
          // render event: time line, activity, and optional customer
          const [activity, customer] = String(arg.event.title).split(' / ')
          
          const formatTime = (d?: Date | null) => {
            if (!d) return ''
            const date = new Date(d)
            const h = date.getHours()
            const m = date.getMinutes()
            const mer = h >= 12 ? 'pm' : 'am'
            let hh = h % 12
            if (hh === 0) hh = 12
            if (m === 0) return `${hh}${mer}`
            const mm = String(m).padStart(2, '0')
            return `${hh}.${mm}${mer}`
          }
          const time = formatTime(arg.event.start)
          return (
            <div className="fc-event-main">
              {time ? <div className="fc-event-time">{time}</div> : null}
              <div className="fc-event-activity">{activity}</div>
              {customer ? <div className="fc-event-customer">{customer}</div> : null}
            </div>
          )
        }}
        // add native title attribute for hover tooltip
        eventDidMount={(info) => info.el?.setAttribute?.('title', String(info.event.title))}
        // update header title when visible range changes
        datesSet={(info) => { try { setTitle(formatHeader(info)) } catch(e) { setTitle(info.view?.title || '') } }}
        height="auto"
        eventColor="#1976d2"
        dayHeaderFormat={{ weekday: 'short' }}
      />
    </Box>
  )
}
