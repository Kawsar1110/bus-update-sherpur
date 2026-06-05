import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import { fetchBuses } from './lib/supabase'

function NavBar() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: '1px solid #e2e8f0',
      display: 'flex', zIndex: 100,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.08)'
    }}>
      <Link to='/' style={{
        flex: 1, padding: '12px 0', textAlign: 'center', textDecoration: 'none',
        color: !isAdmin ? '#16a34a' : '#9ca3af',
        borderTop: !isAdmin ? '3px solid #16a34a' : '3px solid transparent',
        fontFamily: 'SolaimanLipi, Kalpurush, sans-serif', fontSize: '12px', fontWeight: '600'
      }}>
        🚌<br/>সময়সূচী
      </Link>
      <Link to='/admin' style={{
        flex: 1, padding: '12px 0', textAlign: 'center', textDecoration: 'none',
        color: isAdmin ? '#16a34a' : '#9ca3af',
        borderTop: isAdmin ? '3px solid #16a34a' : '3px solid transparent',
        fontFamily: 'SolaimanLipi, Kalpurush, sans-serif', fontSize: '12px', fontWeight: '600'
      }}>
        ⚙️<br/>অ্যাডমিন
      </Link>
    </div>
  )
}

export default function App() {
  const [dbBuses, setDbBuses] = useState(null)

  async function loadBuses() {
    const data = await fetchBuses()
    if (data) setDbBuses(data)
  }

  useEffect(() => { loadBuses() }, [])

  return (
    <BrowserRouter>
      <div style={{ paddingBottom: '64px' }}>
        <Routes>
          <Route path='/' element={<Home dbBuses={dbBuses} />} />
          <Route path='/admin' element={<Admin onBusesChange={loadBuses} />} />
        </Routes>
      </div>
      <NavBar />
    </BrowserRouter>
  )
}
