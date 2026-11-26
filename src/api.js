import { supabase } from './supabase'

function traduire(erreur) {
  if (erreur.code === 'PGRST204' || erreur.code === '42703') {
    return 'La base de données doit être mise à jour (colonne manquante). Exécutez la migration SQL.'
  }
  if (erreur.code === '42501' || /row-level security/i.test(erreur.message)) {
    return 'Écriture refusée : la règle Supabase n’est pas encore installée.'
  }
  if (erreur.code === '23505') return 'Ce voyage existe déjà (même date, camion et trajet).'
  if (erreur.code === '23503') return 'Camion inconnu : vérifiez la fiche camion.'
  return 'Enregistrement impossible. Réessayez.'
}

function champs(voyage) {
  return {
    date: voyage.date,
    camion: voyage.camion,
    chauffeur: voyage.chauffeur,
    materiaux: voyage.materiaux,
    trajet: voyage.trajet.trim(),
    bl_casa: voyage.bl_casa?.trim() || null,
    bl_transport: voyage.bl_transport?.trim() || null,
    client: voyage.client?.trim() || null,
    infraction: voyage.infraction || null,
    tonnes: Number(voyage.tonnes),
  }
}

export async function ajouterVoyage(voyage) {
  const { data, error } = await supabase
    .from('voyages')
    .insert(champs(voyage))
    .select()
    .single()

  if (error) return { ok: false, error: traduire(error) }
  return { ok: true, voyage: data }
}

export async function modifierVoyage(id, voyage) {
  const { data, error } = await supabase
    .from('voyages')
    .update(champs(voyage))
    .eq('id', id)
    .select()
    .single()

  if (error) return { ok: false, error: traduire(error) }
  return { ok: true, voyage: data }
}
