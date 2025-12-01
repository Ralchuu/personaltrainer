import { Link, useLocation } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PersonIcon from '@mui/icons-material/Person'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'

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
      </List>
    </Drawer>
  )
}
