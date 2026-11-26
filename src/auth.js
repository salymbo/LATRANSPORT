import { supabase } from './supabase'

const SESSION_KEY = 'latransport-session'
const DEMO_USER = 'gerant@latransport.tn'
const DEMO_PASS = 'latransport2026'

export async function sessionActive() {
  if (!supabase) return sessionStorage.getItem(SESSION_KEY) === '1'
  const { data } = await supabase.auth.getSession()
  return Boolean(data.session)
}

export async function signIn(email, password) {
  if (!supabase) {
    const ok = email.trim().toLowerCase() === DEMO_USER && password === DEMO_PASS
    if (!ok) return { ok: false, error: 'E-mail ou mot de passe incorrect.' }
    sessionStorage.setItem(SESSION_KEY, '1')
    return { ok: true }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) return { ok: false, error: traduire(error.message) }
  return { ok: true }
}

export async function signOut() {
  if (!supabase) {
    sessionStorage.removeItem(SESSION_KEY)
    return
  }
  await supabase.auth.signOut()
}

function traduire(message) {
  if (/invalid login credentials/i.test(message)) return 'E-mail ou mot de passe incorrect.'
  if (/email not confirmed/i.test(message)) return 'E-mail non confirmé. Contactez l’administrateur.'
  if (/rate limit/i.test(message)) return 'Trop de tentatives. Réessayez dans quelques minutes.'
  return 'Connexion impossible pour le moment. Réessayez.'
}
