import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import NavBar from './components/NavBar'
import Sidebar from './components/Sidebar'
import Customers from './pages/Customers'
import Trainings from './pages/Trainings'
import Calendar from './pages/Calendar'
import Stats from './pages/Stats'

function App() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={`app-root ${collapsed ? 'sidebar-collapsed' : ''}`}
      // when `collapsed` is true the drawer is closed
      style={{ ['--sidebar-width' as any]: collapsed ? '0px' : '240px' }}
    >
      <NavBar onToggle={() => setCollapsed((s) => !s)} />
      <Sidebar collapsed={collapsed} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/customers" replace />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
