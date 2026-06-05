import { Phone, MapPin, Clock, Bus } from 'lucide-react'

const sessionColors = {
  morning: { bg: '#fef9c3', border: '#fbbf24', badge: '#d97706', label: 'সকাল' },
  afternoon: { bg: '#dbeafe', border: '#60a5fa', badge: '#2563eb', label: 'দুপুর/বিকেল' },
  night: { bg: '#ede9fe', border: '#a78bfa', badge: '#7c3aed', label: 'সন্ধ্যা/রাত' },
}

export default function BusCard({ bus, onEdit, onDelete, isAdmin }) {
  const colors = sessionColors[bus.session] || sessionColors.morning

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      border: `2px solid ${colors.border}`,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'transform 0.15s, box-shadow 0.15s',
      display: 'flex',
      flexDirection: 'column',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.13)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)' }}
    >
      {/* Image or placeholder */}
      {bus.image_url ? (
        <img src={bus.image_url} alt={bus.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
      ) : (
        <div style={{ background: colors.bg, height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bus size={36} color={colors.badge} />
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '14px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1e293b', fontFamily: 'SolaimanLipi, Kalpurush, sans-serif', lineHeight: '1.4' }}>
            {bus.name}
          </h3>
          <span style={{
            background: colors.badge, color: '#fff',
            borderRadius: '20px', padding: '2px 10px',
            fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap', marginLeft: '6px'
          }}>
            {bus.period}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '13px' }}>
            <Clock size={13} color={colors.badge} />
            <span style={{ fontWeight: '700', color: '#16a34a', fontSize: '15px' }}>{bus.time}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '13px' }}>
            <MapPin size={13} color='#ef4444' />
            <span>{bus.terminal} → <strong>{bus.destination}</strong></span>
          </div>

          <a href={`tel:${bus.phone}`} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#16a34a', fontSize: '13px', textDecoration: 'none', fontWeight: '600',
            background: '#f0fdf4', borderRadius: '8px', padding: '6px 10px', marginTop: '4px'
          }}>
            <Phone size={13} />
            {bus.phone}
          </a>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button onClick={() => onEdit(bus)} style={{
              flex: 1, padding: '6px', background: '#dbeafe', color: '#1d4ed8',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'
            }}>✏️ এডিট</button>
            <button onClick={() => onDelete(bus.id)} style={{
              flex: 1, padding: '6px', background: '#fee2e2', color: '#dc2626',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'
            }}>🗑️ মুছুন</button>
          </div>
        )}
      </div>
    </div>
  )
}
