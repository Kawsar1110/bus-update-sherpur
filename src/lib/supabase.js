import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseKey) : null

// =============================================
// SUPABASE SETUP — Run this SQL in SQL Editor
// =============================================
// CREATE TABLE buses (
//   id BIGSERIAL PRIMARY KEY,
//   name TEXT NOT NULL,
//   terminal TEXT NOT NULL,
//   period TEXT NOT NULL,
//   time TEXT NOT NULL,
//   destination TEXT NOT NULL,
//   phone TEXT NOT NULL,
//   route TEXT NOT NULL DEFAULT 'dhaka-to-sherpur',
//   session TEXT NOT NULL CHECK (session IN ('morning','afternoon','night')),
//   image_url TEXT,
//   active BOOLEAN DEFAULT true,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
// ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public read" ON buses FOR SELECT USING (true);
// CREATE POLICY "Admin insert" ON buses FOR INSERT WITH CHECK (true);
// CREATE POLICY "Admin update" ON buses FOR UPDATE USING (true);
// CREATE POLICY "Admin delete" ON buses FOR DELETE USING (true);
//
// Storage bucket: name = "bus-images", Public = true
// =============================================

export async function fetchBuses() {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('buses')
    .select('*')
    .eq('active', true)
    .order('route')
    .order('session')
    .order('time')
  if (error) { console.error(error); return null }
  return data
}

export async function addBus(bus) {
  if (!supabase) return null
  const { data, error } = await supabase.from('buses').insert([bus]).select()
  if (error) throw error
  return data
}

export async function updateBus(id, updates) {
  if (!supabase) return null
  const { data, error } = await supabase.from('buses').update(updates).eq('id', id).select()
  if (error) throw error
  return data
}

export async function deleteBus(id) {
  if (!supabase) return null
  const { error } = await supabase.from('buses').update({ active: false }).eq('id', id)
  if (error) throw error
}

export async function uploadImage(file) {
  if (!supabase) return null
  const ext = file.name.split('.').pop()
  const fileName = `bus-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('bus-images').upload(fileName, file)
  if (error) throw error
  const { data } = supabase.storage.from('bus-images').getPublicUrl(fileName)
  return data.publicUrl
}
