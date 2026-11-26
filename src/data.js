import { supabase } from './supabase'

/* Données de démonstration — utilisées si Supabase n'est pas configuré
   ou si les tables sont vides. */

export const demoCamions = [
  { id: 'LT-214-TN', modele: 'Mercedes Atego 8×4', annee: 2019, km: 248500, etat: 'En service' },
  { id: 'LT-318-TN', modele: 'Renault K 440', annee: 2021, km: 186300, etat: 'En service' },
  { id: 'LT-402-TN', modele: 'MAN TGS 33.400', annee: 2018, km: 312800, etat: 'En atelier' },
  { id: 'LT-455-TN', modele: 'Volvo FMX 460', annee: 2022, km: 97400, etat: 'En service' },
  { id: 'LT-509-TN', modele: 'Scania G410', annee: 2020, km: 204100, etat: 'En service' },
]

export const demoChauffeurs = [
  { nom: 'Mohamed Ben Lakhel', permis: 'C', tel: '98 214 553', camion: 'LT-214-TN', statut: 'Gérant' },
  { nom: 'Karim Trabelsi', permis: 'CE', tel: '22 431 087', camion: 'LT-318-TN', statut: 'Disponible' },
  { nom: 'Sofiane Gharbi', permis: 'C', tel: '44 902 611', camion: 'LT-402-TN', statut: 'En arrêt' },
  { nom: 'Hichem Zouari', permis: 'CE', tel: '31 775 420', camion: 'LT-455-TN', statut: 'En tournée' },
  { nom: 'Rania Ben Salah', permis: 'C', tel: '55 128 903', camion: 'LT-509-TN', statut: 'Disponible' },
]

export const demoVoyages = [
  { date: '2026-11-24', camion: 'LT-455-TN', chauffeur: 'Hichem Zouari', materiaux: 'Gravier 8/15', trajet: 'Bizerte → Mateur', tonnes: 28.1 },
  { date: '2026-11-20', camion: 'LT-214-TN', chauffeur: 'Karim Trabelsi', materiaux: 'Sable 0/4', trajet: 'Bizerte → Menzel Jemil', tonnes: 26.4 },
  { date: '2026-11-13', camion: 'LT-509-TN', chauffeur: 'Rania Ben Salah', materiaux: 'Enrochement', trajet: 'Carrière → Port', tonnes: 24.8 },
  { date: '2026-11-06', camion: 'LT-318-TN', chauffeur: 'Karim Trabelsi', materiaux: 'Remblais', trajet: 'Bizerte → Ghazala', tonnes: 27.9 },
  { date: '2026-10-28', camion: 'LT-455-TN', chauffeur: 'Hichem Zouari', materiaux: 'Gravier 15/25', trajet: 'Bizerte → Tunis', tonnes: 29.2 },
  { date: '2026-10-15', camion: 'LT-214-TN', chauffeur: 'Mohamed Ben Lakhel', materiaux: 'Sable 0/4', trajet: 'Bizerte → Sidi Bou Saïd', tonnes: 25.9 },
  { date: '2026-10-02', camion: 'LT-509-TN', chauffeur: 'Rania Ben Salah', materiaux: 'Remblais', trajet: 'Bizerte → Ras Jebel', tonnes: 27.3 },
  { date: '2026-09-24', camion: 'LT-455-TN', chauffeur: 'Hichem Zouari', materiaux: 'Gravier 8/15', trajet: 'Bizerte → Mateur', tonnes: 28.4 },
  { date: '2026-09-12', camion: 'LT-318-TN', chauffeur: 'Karim Trabelsi', materiaux: 'Enrochement', trajet: 'Carrière → Port', tonnes: 24.6 },
  { date: '2026-09-03', camion: 'LT-214-TN', chauffeur: 'Karim Trabelsi', materiaux: 'Sable 0/4', trajet: 'Bizerte → Menzel Jemil', tonnes: 26.7 },
  { date: '2026-08-21', camion: 'LT-509-TN', chauffeur: 'Rania Ben Salah', materiaux: 'Remblais', trajet: 'Bizerte → Ghazala', tonnes: 27.9 },
  { date: '2026-08-08', camion: 'LT-455-TN', chauffeur: 'Hichem Zouari', materiaux: 'Gravier 15/25', trajet: 'Bizerte → Tunis', tonnes: 29.2 },
  { date: '2026-07-19', camion: 'LT-214-TN', chauffeur: 'Mohamed Ben Lakhel', materiaux: 'Sable 0/4', trajet: 'Bizerte → Sidi Bou Saïd', tonnes: 25.9 },
  { date: '2026-07-06', camion: 'LT-318-TN', chauffeur: 'Karim Trabelsi', materiaux: 'Enrochement', trajet: 'Carrière → Port', tonnes: 24.8 },
  { date: '2026-06-27', camion: 'LT-509-TN', chauffeur: 'Rania Ben Salah', materiaux: 'Remblais', trajet: 'Bizerte → Ras Jebel', tonnes: 25.6 },
  { date: '2026-06-18', camion: 'LT-455-TN', chauffeur: 'Hichem Zouari', materiaux: 'Gravier 8/15', trajet: 'Bizerte → Mateur', tonnes: 28.1 },
  { date: '2026-06-04', camion: 'LT-214-TN', chauffeur: 'Karim Trabelsi', materiaux: 'Sable 0/4', trajet: 'Bizerte → Menzel Jemil', tonnes: 26.4 },
]

export async function loadDashboardData() {
  if (!supabase) {
    return { camions: demoCamions, chauffeurs: demoChauffeurs, voyages: demoVoyages, source: 'demo' }
  }

  const [camions, chauffeurs, voyages] = await Promise.all([
    supabase.from('camions').select('*').order('id'),
    supabase.from('chauffeurs').select('*').order('nom'),
    supabase.from('voyages').select('*').order('date', { ascending: false }).limit(500),
  ])

  const erreur = camions.error || chauffeurs.error || voyages.error
  if (erreur || !camions.data || !voyages.data) {
    return { camions: demoCamions, chauffeurs: demoChauffeurs, voyages: demoVoyages, source: 'erreur' }
  }

  return {
    camions: camions.data,
    chauffeurs: chauffeurs.data ?? [],
    voyages: voyages.data,
    source: 'supabase',
  }
}

export function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = String(iso).split('-')
  return d && m && y ? `${d}/${m}` : iso
}

export function tonnageParMois(voyages) {
  const groupes = new Map()
  for (const v of voyages) {
    const mois = String(v.date || '').slice(0, 7)
    if (!mois) continue
    groupes.set(mois, (groupes.get(mois) || 0) + Number(v.tonnes || 0))
  }
  if (groupes.size < 2) return null

  const moisCourts = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
  return [...groupes.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([cle, tonnes]) => ({
      mois: moisCourts[Number(cle.slice(5, 7)) - 1] || cle,
      tonnes: Math.round(tonnes),
    }))
}
