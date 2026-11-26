import { createClient } from '@supabase/supabase-js'

// URL et clé « publishable » : publiques par conception.
// Elles finissent de toute façon dans le bundle ; ce sont les règles RLS
// de Supabase qui protègent les données (lecture réservée aux connectés).
// Les variables d'environnement, si présentes, restent prioritaires.
const URL_PAR_DEFAUT = 'https://lphbcryrfmkcpvkpyylo.supabase.co'
const CLE_PAR_DEFAUT = 'sb_publishable__BdyHkXmyteIiIGrYGXzkQ___o70vto'

const url = import.meta.env.VITE_SUPABASE_URL || URL_PAR_DEFAUT
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || CLE_PAR_DEFAUT

export const supabase = createClient(url, anonKey)
export const modeDemo = false
