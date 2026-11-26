import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Sans clés configurées, le site fonctionne en mode démo (données fictives).
export const supabase = url && anonKey ? createClient(url, anonKey) : null
export const modeDemo = !supabase
