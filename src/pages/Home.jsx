import { useState, useMemo } from 'react'
import { Search, Bus, ArrowRight } from 'lucide-react'
import BusCard from '../components/BusCard'
import { busData, destinations, routes } from '../data/buses'

const sessions = [
  { key: 'all', label: '🚌 সব' },
  { key: 'morning', label: '🌅 সকাল' },
  { key: 'afternoon', label: '☀️ দুপুর/বিকেল' },
  { key: 'night', label: '🌙 রাত' },
]

export default function Home({ dbBuses }) {
  const [selectedRoute, setSelectedRoute] = useState('dhaka-to-sherpur')
  const [search, setSearch] = useState('')
  const [selectedSession, setSelectedSession] = useState('all')
  const [selectedDest, setSelectedDest] = useState('all')

  const allBuses = dbBuses && dbBuses.length > 0 ? dbBuses : busData

  // Get unique routes actually present in data + predefined routes
  const activeRoutes = routes

  const routeBuses = useMemo(() =>
    allBuses.filter(b => b.route === selectedRoute),
    [allBuses, selectedRoute]
  )

  const filtered = useMemo(() => {
    return routeBuses.filter(bus => {
      const matchSearch = !search ||
        bus.name.includes(search) ||
        bus.destination.includes(search) ||
        bus.terminal.includes(search) ||
        bus.phone.includes(search)
      const matchSession = selectedSession === 'all' || bus.session === selectedSession
      const matchDest = selectedDest === 'all' || bus.destination === selectedDest
      return matchSearch && matchSession && matchDest
    })
  }, [routeBuses, search, selectedSession, selectedDest])

  const currentRoute = activeRoutes.find(r => r.key === selectedRoute)
  const destOptions = destinations[selectedRoute] || []

  function handleRouteChange(routeKey) {
    setSelectedRoute(routeKey)
    setSelectedDest('all')
    setSelectedSession('all')
    setSearch('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)',
        padding: '28px 16px 24px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <div style={{ fontSize: '40px', marginBottom: '6px' }}>🚌</div>
        <h1 style={{
          margin: '0 0 4px', fontSize: '20px', fontWeight: '800',
          fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif',
        }}>শেরপুর বাস সময়সূচী</h1>
        <p style={{ margin: '0 0 20px', opacity: 0.85, fontSize: '12px', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif' }}>
          সঠিক বাস খুঁজুন, সময়মতো পৌঁছান
        </p>

        {/* Route Switcher */}
        <div style={{
          display: 'flex', gap: '0', maxWidth: '420px', margin: '0 auto 18px',
          background: 'rgba(0,0,0,0.2)', borderRadius: '14px', padding: '4px',
        }}>
          {activeRoutes.map(route => (
            <button
              key={route.key}
              onClick={() => handleRouteChange(route.key)}
              style={{
                flex: 1, padding: '10px 8px',
                background: selectedRoute === route.key ? '#fff' : 'transparent',
                color: selectedRoute === route.key ? '#16a34a' : 'rgba(255,255,255,0.85)',
                border: 'none', borderRadius: '10px', cursor: 'pointer',
                fontSize: '12px', fontWeight: '700',
                fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              }}
            >
              <span>{route.from}</span>
              <ArrowRight size={12} />
              <span>{route.to}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
          <Search size={16} color='#9ca3af' style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type='text'
            placeholder='বাসের নাম, গন্তব্য বা ফোন নম্বর...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 40px',
              borderRadius: '12px', border: 'none', fontSize: '14px',
              fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif',
              background: '#fff', boxSizing: 'border-box',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)', outline: 'none', color: '#1e293b',
            }}
          />
        </div>
      </div>

      {/* Current route label */}
      <div style={{
        background: '#166534', color: '#bbf7d0',
        textAlign: 'center', padding: '8px',
        fontSize: '13px', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif',
        fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
      }}>
        <span>{currentRoute?.from}</span>
        <ArrowRight size={13} />
        <span>{currentRoute?.to}</span>
        <span style={{ opacity: 0.7, fontWeight: '400' }}>• {routeBuses.length}টি বাস</span>
      </div>

      {/* Filters */}
      <div style={{
        background: '#fff', padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        {/* Session tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', marginBottom: '10px', scrollbarWidth: 'none' }}>
          {sessions.map(s => (
            <button key={s.key} onClick={() => setSelectedSession(s.key)} style={{
              padding: '7px 14px', borderRadius: '20px',
              border: `2px solid ${selectedSession === s.key ? '#16a34a' : '#e2e8f0'}`,
              background: selectedSession === s.key ? '#16a34a' : '#fff',
              color: selectedSession === s.key ? '#fff' : '#64748b',
              cursor: 'pointer', fontSize: '12px', fontWeight: '700',
              whiteSpace: 'nowrap', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif',
              transition: 'all 0.15s', flexShrink: 0,
            }}>{s.label}</button>
          ))}
        </div>

        {/* Destination select */}
        <select
          value={selectedDest}
          onChange={e => setSelectedDest(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: '10px',
            border: '2px solid #e2e8f0', background: '#f8fafc',
            fontSize: '13px', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif',
            color: '#374151', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value='all'>📍 সব গন্তব্য দেখুন</option>
          {destOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Count */}
      <div style={{ padding: '10px 16px 4px', color: '#64748b', fontSize: '13px', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif' }}>
        <strong style={{ color: '#16a34a' }}>{filtered.length}টি</strong> বাস পাওয়া গেছে
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '16px', padding: '12px 16px 80px',
      }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 16px', color: '#9ca3af' }}>
            <Bus size={52} style={{ opacity: 0.25, display: 'block', margin: '0 auto 12px' }} />
            <p style={{ fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif', fontSize: '15px', margin: 0 }}>
              {routeBuses.length === 0 ? 'এই রুটে এখনো কোনো বাস যোগ করা হয়নি' : 'কোনো বাস পাওয়া যায়নি'}
            </p>
            <p style={{ fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif', fontSize: '12px', marginTop: '6px', color: '#cbd5e1' }}>
              {routeBuses.length === 0 ? 'অ্যাডমিন প্যানেল থেকে বাস যোগ করুন' : 'অনুসন্ধান পরিবর্তন করুন'}
            </p>
          </div>
        ) : (
          filtered.map(bus => <BusCard key={bus.id} bus={bus} />)
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: '#166534', color: '#86efac',
        textAlign: 'center', padding: '14px',
        fontSize: '12px', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif',
      }}>
        বাস ফ্যান অফ শেরপুর গ্রুপ কর্তৃক প্রস্তুতকৃত
      </div>
    </div>
  )
}
