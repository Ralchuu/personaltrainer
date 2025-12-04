import { useEffect, useState } from 'react'
import { getTrainingsWithCustomer } from '../api/trainingApi'
import type { Training } from '../types/training'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Label } from 'recharts'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// StatsPage: Display training statistics as a bar chart showing total minutes per activity.
export default function StatsPage() {
  const [data, setData] = useState<Array<{ activity: string; minutes: number }>>([])
  const [count, setCount] = useState(0)
  const [chartKey, setChartKey] = useState(0)

  useEffect(() => {
    getTrainingsWithCustomer().then((list: Training[]) => {
      setCount(list.length)

      const totals: Record<string, number> = {}
      list.forEach(t => {
        const activity = t.activity || 'Unknown'
        const minutes = typeof t.duration === 'number' ? t.duration : parseFloat(String(t.duration || 0))
        totals[activity] = (totals[activity] || 0) + minutes
      })

      const rows = Object.entries(totals).map(([activity, minutes]) => ({ activity, minutes }))
      rows.sort((a, b) => b.minutes - a.minutes)
      setData(rows)
      setChartKey(k => k + 1)
    })
  }, [])

  return (
    <Box component="section" sx={{ px: 2, width: `calc(100vw - var(--sidebar-width) - 64px)`, maxWidth: 'none' }}>
      <Typography variant="h5" gutterBottom>Statistics</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Total time (minutes) per activity
      </Typography>
      <Typography variant="caption" color="text.secondary" gutterBottom>
        {count > 0 ? `${count} trainings processed` : 'No trainings found'}
      </Typography>

      <Box sx={{ width: '100%', height: 520, minWidth: 0 }}>
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
