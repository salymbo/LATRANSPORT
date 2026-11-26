import { createClient } from '@supabase/supabase-js'

// URL et clé « publishable » : publiques par conception.
// Elles finissent de toute façon dans le bundle ; ce sont les règles RLS
// de Supabase qui protègent les données (lecture réservée aux connectés).
const URL_PAR_DEFAUT = 'https://lphbcryrfmkcpvkpyylo.supabase.co'
const CLE_PAR_DEFAUT = 'sb_publishable__BdyHkXmyteIiIGrYGXzkQ___o70vto'

// Une variable d'environnement n'est utilisée que si elle a l'air valide :
// un secret mal recopié ne doit pas casser le site en production.
function urlValide(valeur) {
  return typeof valeur === 'string' && /^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(valeur.trim())
}

function cleValide(valeur) {
  if (typeof valeur !== 'string') return false
  const v = valeur.trim()
  return (
    /^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(v) ||
    /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(v)
  )
}

const urlEnv = import.meta.env.VITE_SUPABASE_URL
const cleEnv = import.meta.env.VITE_SUPABASE_ANON_KEY

const url = urlValide(urlEnv) ? urlEnv.trim().replace(/\/$/, '') : URL_PAR_DEFAUT
const anonKey = cleValide(cleEnv) ? cleEnv.trim() : CLE_PAR_DEFAUT

export const supabase = createClient(url, anonKey)
export const modeDemo = false
