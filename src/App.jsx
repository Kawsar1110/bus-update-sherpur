import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import { fetchBuses } from './lib/supabase'

export default function App() {
  const [dbBuses, setDbBuses] = useState(null)

  async function loadBuses() {
    const data = await fetchBuses()
    if (data) setDbBuses(data)
  }

  useEffect(() => {
    loadBuses()

    // Track PWA install
    window.addEventListener('appinstalled', () => {
      if (window.gtag) {
        window.gtag('event', 'pwa_installed', {
          event_category: 'PWA',
          event_label: 'App Installed',
        })
      }
    })

    // Track PWA install prompt shown
    window.addEventListener('beforeinstallprompt', () => {
      if (window.gtag) {
        window.gtag('event', 'pwa_install_prompt', {
          event_category: 'PWA',
          event_label: 'Install Prompt Shown',
        })
      }
    })
  }, [])

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<Home dbBuses={dbBuses} />} />
          <Route path='/admin' element={<Admin onBusesChange={loadBuses} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}