import { Link, useLocation } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PersonIcon from '@mui/icons-material/Person'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import BarChartIcon from '@mui/icons-material/BarChart'

type Props = {
  collapsed?: boolean
}

export default function Sidebar({ collapsed = false }: Props){
  const loc = useLocation()
  const width = 240

  return (
    <Drawer
      variant="persistent"
      open={!collapsed}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          // hide the paper entirely when closed
          display: collapsed ? 'none' : 'block'
        }
      }}
    >
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/customers" selected={loc.pathname.startsWith('/customers')}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            {!collapsed && <ListItemText primary="Customers" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/trainings" selected={loc.pathname.startsWith('/trainings')}>
            <ListItemIcon><DirectionsRunIcon fontSize="small" /></ListItemIcon>
            {!collapsed && <ListItemText primary="Trainings" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/calendar" selected={loc.pathname.startsWith('/calendar')}>
            <ListItemIcon><CalendarMonthIcon fontSize="small" /></ListItemIcon>
            {!collapsed && <ListItemText primary="Calendar" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/stats" selected={loc.pathname.startsWith('/stats')}>
            <ListItemIcon><BarChartIcon fontSize="small" /></ListItemIcon>
            {!collapsed && <ListItemText primary="Statistics" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}
