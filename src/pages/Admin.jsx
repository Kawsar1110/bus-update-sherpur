import { useState, useEffect } from 'react'
import { Plus, LogOut, Save, X, Upload, Bus, ArrowRight } from 'lucide-react'
import { addBus, updateBus, deleteBus, uploadImage, fetchBuses } from '../lib/supabase'
import { busData, destinations, terminals, routes } from '../data/buses'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'sherpur2024'

const emptyForm = {
  name: '', terminal: '', period: 'সকাল', time: '',
  destination: '', phone: '', route: 'dhaka-to-sherpur',
  session: 'morning', image_url: ''
}

const periodOptions = ['ভোর','সকাল','দুপুর','বিকেল','সন্ধ্যা','রাত']
const sessionOptions = [
  { value: 'morning', label: '🌅 সকাল (Morning)' },
  { value: 'afternoon', label: '☀️ দুপুর/বিকেল (Afternoon)' },
  { value: 'night', label: '🌙 সন্ধ্যা/রাত (Night)' },
]

export default function Admin({ onBusesChange }) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [buses, setBuses] = useState([])
  const [filterRoute, setFilterRoute] = useState('all')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [feedback, setFeedback] = useState('')
  const [useSupabase, setUseSupabase] = useState(false)
  const [customRoute, setCustomRoute] = useState('')
  const [showCustomRoute, setShowCustomRoute] = useState(false)

  const flash = (msg) => { setFeedback(msg); setTimeout(() => setFeedback(''), 3500) }

  useEffect(() => { if (authed) loadBuses() }, [authed])

  async function loadBuses() {
    const dbData = await fetchBuses()
    if (dbData) { setBuses(dbData); setUseSupabase(true) }
    else setBuses(busData)
  }

  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) { setAuthed(true); setPwError('') }
    else setPwError('ভুল পাসওয়ার্ড! চেষ্টা করুন আবার।')
  }

  function handleEdit(bus) {
    setForm({ ...bus })
    setEditingId(bus.id)
    setImagePreview(bus.image_url || '')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleNewBus() {
    setForm({ ...emptyForm, route: filterRoute !== 'all' ? filterRoute : 'dhaka-to-sherpur' })
    setEditingId(null)
    setImagePreview('')
    setImageFile(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      let imageUrl = form.image_url
      if (imageFile && useSupabase) imageUrl = await uploadImage(imageFile)
      const busPayload = { ...form, image_url: imageUrl }
      if (useSupabase) {
        if (editingId) { await updateBus(editingId, busPayload); flash('✅ বাস আপডেট হয়েছে!') }
        else { await addBus(busPayload); flash('✅ নতুন বাস যোগ হয়েছে!') }
        await loadBuses()
        if (onBusesChange) onBusesChange()
      } else {
        flash('⚠️ Supabase সংযুক্ত নয়। .env ফাইলে VITE_SUPABASE_URL এবং VITE_SUPABASE_ANON_KEY যোগ করুন।')
      }
      setShowForm(false); setForm(emptyForm); setEditingId(null); setImageFile(null); setImagePreview('')
    } catch (err) { flash('❌ Error: ' + err.message) }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('এই বাসটি মুছে ফেলবেন?')) return
    if (useSupabase) { await deleteBus(id); flash('🗑️ মুছে ফেলা হয়েছে'); loadBuses(); if (onBusesChange) onBusesChange() }
    else flash('⚠️ Supabase সংযুক্ত নয়।')
  }

  // All routes from data + predefined routes merged unique
  const allRouteKeys = [...new Set([...routes.map(r => r.key), ...buses.map(b => b.route)])]
  const allRoutes = allRouteKeys.map(key => {
    const found = routes.find(r => r.key === key)
    if (found) return found
    // custom route — derive label from key
    const parts = key.split('-to-')
    return { key, label: parts.join(' → '), from: parts[0] || key, to: parts[1] || '' }
  })

  const displayedBuses = filterRoute === 'all' ? buses : buses.filter(b => b.route === filterRoute)

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '10px',
    border: '2px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box',
    fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif', outline: 'none',
    background: '#f8fafc',
  }
  const labelStyle = {
    display: 'block', marginBottom: '6px', fontSize: '13px',
    fontWeight: '600', color: '#374151', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif'
  }

  const routeDestinations = destinations[form.route] || []
  const routeTerminals = terminals[form.route] || []

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '40px 32px', width: '100%', maxWidth: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔐</div>
        <h2 style={{ margin: '0 0 8px', color: '#166534', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif' }}>অ্যাডমিন প্যানেল</h2>
        <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '13px', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif' }}>বাস যোগ, সম্পাদনা ও মুছতে লগইন করুন</p>
        <form onSubmit={handleLogin}>
          <input
            type='password' placeholder='পাসওয়ার্ড দিন'
            value={password} onChange={e => setPassword(e.target.value)}
            style={{ ...inputStyle, marginBottom: '12px', textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
          />
          {pwError && <p style={{ color: '#ef4444', margin: '0 0 12px', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif', fontSize: '13px' }}>{pwError}</p>}
          <button type='submit' style={{
            width: '100%', padding: '13px', background: '#16a34a', color: '#fff',
            border: 'none', borderRadius: '12px', fontSize: '15px', cursor: 'pointer',
            fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif', fontWeight: '700'
          }}>প্রবেশ করুন</button>
        </form>
        <p style={{ marginTop: '16px', fontSize: '11px', color: '#cbd5e1', fontFamily: 'monospace' }}>Default: sherpur2024</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #166534, #15803d)', padding: '18px 16px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '17px', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif' }}>⚙️ অ্যাডমিন প্যানেল</h1>
          <p style={{ margin: '3px 0 0', opacity: 0.8, fontSize: '11px', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif' }}>
            {useSupabase ? '🟢 Supabase সংযুক্ত' : '🔴 Static Data (Supabase নেই)'}
          </p>
        </div>
        <button onClick={() => setAuthed(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <LogOut size={14} /> বের হন
        </button>
      </div>

      {feedback && (
        <div style={{ margin: '12px 16px', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', color: '#166534', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif', fontSize: '13px' }}>
          {feedback}
        </div>
      )}

      <div style={{ padding: '16px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Add Button */}
        {!showForm && (
          <button onClick={handleNewBus} style={{
            width: '100%', padding: '14px', background: '#16a34a', color: '#fff',
            border: 'none', borderRadius: '14px', fontSize: '15px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif', fontWeight: '700',
            marginBottom: '16px', boxShadow: '0 4px 12px rgba(22,163,74,0.3)'
          }}>
            <Plus size={18} /> নতুন বাস যোগ করুন
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '2px solid #bbf7d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#166534', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif' }}>
                {editingId ? '✏️ বাস সম্পাদনা' : '➕ নতুন বাস'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: '#fee2e2', border: 'none', color: '#dc2626', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>

                {/* Route selector — most important */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>রুট (Route) *</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {allRoutes.map(r => (
                      <button key={r.key} type='button'
                        onClick={() => { setForm({ ...form, route: r.key, destination: '', terminal: '' }); setShowCustomRoute(false) }}
                        style={{
                          padding: '9px 16px', borderRadius: '10px', cursor: 'pointer',
                          border: `2px solid ${form.route === r.key ? '#16a34a' : '#e2e8f0'}`,
                          background: form.route === r.key ? '#f0fdf4' : '#fff',
                          color: form.route === r.key ? '#16a34a' : '#64748b',
                          fontSize: '13px', fontWeight: '600',
                          fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif',
                          display: 'flex', alignItems: 'center', gap: '5px',
                        }}>
                        {r.from} <ArrowRight size={12} /> {r.to}
                      </button>
                    ))}
                    {/* Add new route */}
                    <button type='button' onClick={() => setShowCustomRoute(!showCustomRoute)} style={{
                      padding: '9px 16px', borderRadius: '10px', cursor: 'pointer',
                      border: '2px dashed #d1d5db', background: '#fafafa', color: '#9ca3af',
                      fontSize: '13px', fontWeight: '600', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif',
                    }}>+ নতুন রুট</button>
                  </div>
                  {showCustomRoute && (
                    <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        style={{ ...inputStyle, flex: 1 }}
                        placeholder='যেমন: sherpur-to-mymensingh'
                        value={customRoute}
                        onChange={e => setCustomRoute(e.target.value)}
                      />
                      <button type='button' onClick={() => {
                        if (customRoute.trim()) {
                          setForm({ ...form, route: customRoute.trim(), destination: '', terminal: '' })
                          setShowCustomRoute(false)
                        }
                      }} style={{ padding: '10px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>
                        ঠিক আছে
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>বাসের নাম *</label>
                  <input style={inputStyle} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder='যেমন: মোরাদ মহিমা' />
                </div>

                <div>
                  <label style={labelStyle}>ফোন নম্বর *</label>
                  <input style={inputStyle} required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder='01XXXXXXXXX' />
                </div>

                <div>
                  <label style={labelStyle}>সময় *</label>
                  <input style={inputStyle} required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder='6:30' />
                </div>

                <div>
                  <label style={labelStyle}>পর্যায় *</label>
                  <select style={inputStyle} value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}>
                    {periodOptions.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>সেশন *</label>
                  <select style={inputStyle} value={form.session} onChange={e => setForm({ ...form, session: e.target.value })}>
                    {sessionOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>গন্তব্য *</label>
                  <select style={inputStyle} value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })}>
                    <option value=''>-- বেছে নিন --</option>
                    {routeDestinations.map(d => <option key={d}>{d}</option>)}
                    <option value='__custom__'>অন্য (টাইপ করুন)...</option>
                  </select>
                  {(form.destination === '__custom__' || (!routeDestinations.includes(form.destination) && form.destination)) && (
                    <input style={{ ...inputStyle, marginTop: '8px' }} placeholder='গন্তব্য লিখুন' value={form.destination === '__custom__' ? '' : form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>ছাড়ার স্থান (টার্মিনাল) *</label>
                  <select style={inputStyle} value={form.terminal} onChange={e => setForm({ ...form, terminal: e.target.value })}>
                    <option value=''>-- বেছে নিন --</option>
                    {routeTerminals.map(t => <option key={t}>{t}</option>)}
                    <option value='__custom__'>অন্য (টাইপ করুন)...</option>
                  </select>
                  {(form.terminal === '__custom__' || (!routeTerminals.includes(form.terminal) && form.terminal)) && (
                    <input style={{ ...inputStyle, marginTop: '8px' }} placeholder='টার্মিনাল লিখুন' value={form.terminal === '__custom__' ? '' : form.terminal} onChange={e => setForm({ ...form, terminal: e.target.value })} />
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>বাসের ছবি (ঐচ্ছিক)</label>
                  <div style={{ border: '2px dashed #d1d5db', borderRadius: '10px', padding: '20px', textAlign: 'center', background: '#f9fafb', cursor: 'pointer' }}
                    onClick={() => document.getElementById('imgInput').click()}>
                    {imagePreview
                      ? <img src={imagePreview} alt='preview' style={{ maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                      : <div style={{ color: '#9ca3af' }}>
                          <Upload size={28} style={{ marginBottom: '8px' }} />
                          <p style={{ margin: 0, fontSize: '13px', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif' }}>ছবি আপলোড করতে ক্লিক করুন</p>
                        </div>
                    }
                    <input id='imgInput' type='file' accept='image/*' onChange={handleImageChange} style={{ display: 'none' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type='submit' disabled={saving} style={{
                  flex: 1, padding: '13px', background: '#16a34a', color: '#fff',
                  border: 'none', borderRadius: '12px', fontSize: '15px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif', fontWeight: '700', opacity: saving ? 0.7 : 1
                }}>
                  <Save size={16} /> {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                </button>
                <button type='button' onClick={() => setShowForm(false)} style={{ padding: '13px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontSize: '14px', cursor: 'pointer' }}>বাতিল</button>
              </div>
            </form>
          </div>
        )}

        {/* Route Filter Tabs for list */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '12px', scrollbarWidth: 'none' }}>
          <button onClick={() => setFilterRoute('all')} style={{
            padding: '7px 16px', borderRadius: '20px', flexShrink: 0,
            border: `2px solid ${filterRoute === 'all' ? '#16a34a' : '#e2e8f0'}`,
            background: filterRoute === 'all' ? '#16a34a' : '#fff',
            color: filterRoute === 'all' ? '#fff' : '#64748b',
            cursor: 'pointer', fontSize: '12px', fontWeight: '700',
            fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif',
          }}>সব রুট ({buses.length})</button>
          {allRoutes.map(r => {
            const count = buses.filter(b => b.route === r.key).length
            return (
              <button key={r.key} onClick={() => setFilterRoute(r.key)} style={{
                padding: '7px 14px', borderRadius: '20px', flexShrink: 0,
                border: `2px solid ${filterRoute === r.key ? '#16a34a' : '#e2e8f0'}`,
                background: filterRoute === r.key ? '#16a34a' : '#fff',
                color: filterRoute === r.key ? '#fff' : '#64748b',
                cursor: 'pointer', fontSize: '12px', fontWeight: '700',
                fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {r.from} <ArrowRight size={10} /> {r.to} ({count})
              </button>
            )
          })}
        </div>

        {/* Bus List */}
        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ margin: 0, color: '#166534', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif', fontSize: '15px' }}>
              🚌 বাসের তালিকা ({displayedBuses.length}টি)
            </h3>
          </div>
          {displayedBuses.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif' }}>
              এই রুটে কোনো বাস নেই
            </div>
          ) : displayedBuses.map((bus, i) => {
            const r = allRoutes.find(r => r.key === bus.route)
            return (
              <div key={bus.id} style={{
                display: 'flex', alignItems: 'center', padding: '11px 16px', gap: '12px',
                borderBottom: i < displayedBuses.length - 1 ? '1px solid #f1f5f9' : 'none',
                background: i % 2 === 0 ? '#fff' : '#fafafa'
              }}>
                {bus.image_url
                  ? <img src={bus.image_url} alt={bus.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                  : <div style={{ width: '44px', height: '44px', background: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bus size={20} color='#16a34a' />
                    </div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: '#1e293b', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bus.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#6b7280', fontFamily: 'SolaimanLipi, Noto Sans Bengali, sans-serif' }}>
                    {bus.time} • {bus.destination} • {bus.phone}
                  </p>
                  {r && (
                    <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                      {r.from} <ArrowRight size={9} /> {r.to}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => handleEdit(bus)} style={{ padding: '6px 10px', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>✏️</button>
                  <button onClick={() => handleDelete(bus.id)} style={{ padding: '6px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
