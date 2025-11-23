import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

type Props = {
  collapsed?: boolean
}

export default function Sidebar({ collapsed = false }: Props){
  const loc = useLocation()
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-hidden={collapsed}>
      <nav className="side-nav">
        <Link className={`side-link ${loc.pathname.startsWith('/customers') ? 'active' : ''}`} to="/customers" title="Customers">📋</Link>
        <Link className={`side-link ${loc.pathname.startsWith('/trainings') ? 'active' : ''}`} to="/trainings" title="Trainings">🏋️</Link>
        <a className="side-link" href="#" title="Calendar">📅</a>
      </nav>
    </aside>
  )
}
