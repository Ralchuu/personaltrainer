import { useEffect, useState } from 'react'
import { getTrainingsWithCustomer } from '../api/trainingApi'
import type { Training } from '../types/training'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Label } from 'recharts'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function StatsPage() {
  // `data` holds the chart rows: { activity, minutes }
  const [data, setData] = useState<Array<{ activity: string; minutes: number }>>([])
  // `count` shows how many training records were fetched
  const [count, setCount] = useState<number | null>(null)
  // `chartKey` is used to force the chart to remount when data changes
  // (fixes a layout/redraw quirk in Recharts)
  const [chartKey, setChartKey] = useState(0)

  // Load trainings when the component mounts
  useEffect(() => {
    getTrainingsWithCustomer()
      .then((list: Training[]) => {
        // If API response is not an array, treat as empty
        if (!Array.isArray(list)) {
          setCount(0)
          setData([])
          setChartKey(k => k + 1)
          return
        }

        // remember how many trainings we got
        setCount(list.length)

        // Group durations by activity using a simple object map
        const totals: Record<string, number> = {}
        list.forEach(t => {
          const activity = (t.activity || 'Unknown').toString()
          // parse duration values that may be numbers or numeric strings
          let minutes = 0
          if (typeof t.duration === 'number') minutes = t.duration
          else if (typeof t.duration === 'string') {
            const v = parseFloat(t.duration.replace(',', '.'))
            minutes = Number.isFinite(v) ? v : 0
          }
          totals[activity] = (totals[activity] || 0) + minutes
        })

        // Convert the map into an array of rows and sort by minutes desc
        const rows = Object.keys(totals).map(k => ({ activity: k, minutes: totals[k] }))
        rows.sort((a, b) => b.minutes - a.minutes)
        setData(rows)
        // bump key so chart remounts and recalculates layout
        setChartKey(k => k + 1)
      })
      .catch(() => {
        // on error, show zero results
        setCount(0)
        setData([])
        setChartKey(k => k + 1)
      })
  }, [])

  // Render the page: heading, small status text, then the chart
  return (
    <Box component="section" sx={{ px: 2, width: `calc(100vw - var(--sidebar-width) - 64px)`, maxWidth: 'none' }}>
      <Typography variant="h5" gutterBottom>Statistics</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Total time (minutes) per activity
      </Typography>
      {count !== null && (
        <Typography variant="caption" color="text.secondary" gutterBottom>
          {count > 0 ? `${count} trainings processed` : 'No trainings found'}
        </Typography>
      )}

      <Box sx={{ width: '100%', height: 520, minWidth: 0 }}>
        {/* ResponsiveContainer and BarChart render the chart */}
        <ResponsiveContainer key={chartKey} width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} barCategoryGap="6%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="activity" />
            <YAxis>
              <Label angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }}>Duration (min)</Label>
            </YAxis>
            <Tooltip />
            <Bar dataKey="minutes" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}
