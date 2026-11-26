import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY
const email = process.env.CHECK_EMAIL
const password = process.env.CHECK_PASSWORD

if (!url || !key) {
  console.error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { persistSession: false } })

console.log('URL :', url)
console.log('Clé :', key.slice(0, 22) + '…')

// 1. La clé est-elle acceptée ?
const { data: camions, error: e1 } = await supabase.from('camions').select('id').limit(3)
console.log('\n[1] Lecture table camions (anonyme) :', e1 ? `${e1.code} — ${e1.message}` : `${camions.length} ligne(s)`)

if (!email || !password) {
  console.log('\n[2] Test de connexion ignoré (CHECK_EMAIL / CHECK_PASSWORD absents)')
  process.exit(0)
}

// 2. Connexion
const { data: auth, error: e2 } = await supabase.auth.signInWithPassword({ email, password })
console.log('\n[2] Connexion', email, ':', e2 ? `${e2.code || e2.status} — ${e2.message}` : `OK (${auth.user.email})`)

if (e2) process.exit(0)

// 3. Lecture avec session
const { data: apres, error: e3 } = await supabase.from('camions').select('id').limit(5)
console.log('\n[3] Lecture camions (connecté) :', e3 ? `${e3.code} — ${e3.message}` : `${apres.length} ligne(s)`)

const { count, error: e4 } = await supabase.from('voyages').select('*', { count: 'exact', head: true })
console.log('[4] Voyages :', e4 ? `${e4.code} — ${e4.message}` : `${count} ligne(s)`)
