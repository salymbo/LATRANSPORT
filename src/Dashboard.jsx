import { useEffect, useMemo, useState } from 'react'
import './dashboard.css'
import { signIn } from './auth'
import { ajouterVoyage } from './api'
import { formatDate, loadDashboardData, tonnageParMois } from './data'
import { modeDemo } from './supabase'

const vues = [
  { id: 'vue', label: 'Vue générale' },
  { id: 'camions', label: 'Camions' },
  { id: 'chauffeurs', label: 'Chauffeurs' },
  { id: 'voyages', label: 'Voyages' },
]

/* ---------- Connexion ---------- */

export function LoginPage({ onSuccess }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [voir, setVoir] = useState(false)
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  async function submit(event) {
    event.preventDefault()
    setEnvoi(true)
    setErreur('')

    const resultat = await signIn(user, pass)
    if (resultat.ok) {
      onSuccess()
      return
    }
    setErreur(resultat.error)
    setEnvoi(false)
  }

  return (
    <div className="auth">
      <aside className="auth__aside">
        <a className="auth__brand" href="#top">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="LA Transport" width="120" height="102" />
        </a>
        <div className="auth__pitch">
          <p className="eyebrow eyebrow--light">Espace gérant</p>
          <h1>Le cœur de la société, en un coup d’œil.</h1>
          <p>
            Camions, chauffeurs, voyages et tonnages : les chiffres du jour, réservés à la
            direction.
          </p>
        </div>
        <p className="auth__foot">Mohamed Ben Lakhel · Bizerte, Tunisie</p>
      </aside>

      <main className="auth__panel">
        <form className="auth__form" onSubmit={submit} noValidate>
          <a className="auth__back" href="#top">
            ← Retour au site
          </a>

          <h2>Connexion</h2>
          <p className="auth__hint">Accès réservé au gérant.</p>

          <div className="field">
            <label htmlFor="user">E-mail</label>
            <input
              id="user"
              name="user"
              type="email"
              inputMode="email"
              autoComplete="username"
              placeholder="votre@email.tn"
              value={user}
              onChange={(event) => setUser(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="pass">Mot de passe</label>
            <div className="auth__pass">
              <input
                id="pass"
                name="pass"
                type={voir ? 'text' : 'password'}
                autoComplete="current-password"
                value={pass}
                onChange={(event) => setPass(event.target.value)}
                required
              />
              <button
                type="button"
                className="auth__eye"
                onClick={() => setVoir((v) => !v)}
                aria-label={voir ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {voir ? 'Masquer' : 'Voir'}
              </button>
            </div>
          </div>

          {erreur && (
            <p className="auth__error" role="alert">
              {erreur}
            </p>
          )}

          {modeDemo && (
            <p className="auth__note">
              Mode démonstration : la connexion réelle sera active dès que la base de données
              sera branchée.
            </p>
          )}

          <button className="btn btn--solid auth__submit" type="submit" disabled={envoi}>
            {envoi ? 'Connexion…' : 'Se connecter'}
          </button>

          <p className="auth__demo">Accès strictement réservé à la direction de LA Transport.</p>
        </form>
      </main>
    </div>
  )
}

/* ---------- Briques ---------- */

function Carte({ label, valeur, unite, note, accent }) {
  return (
    <article className={`kpi${accent ? ` kpi--${accent}` : ''}`}>
      <p className="kpi__label">{label}</p>
      <p className="kpi__value">
        {valeur}
        {unite && <span>{unite}</span>}
      </p>
      {note && <p className="kpi__note">{note}</p>}
    </article>
  )
}

function Vide({ children }) {
  return <p className="vide">{children}</p>
}

function Graphique({ series }) {
  const max = Math.max(...series.map((m) => m.tonnes), 1)
  return (
    <div className="chart" role="img" aria-label="Tonnage livré par mois">
      {series.map((m) => (
        <div className="chart__col" key={m.mois}>
          <span className="chart__value">{m.tonnes}</span>
          <div className="chart__bar" style={{ height: `${Math.round((m.tonnes / max) * 100)}%` }} />
          <span className="chart__label">{m.mois}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------- Vues ---------- */

function VueGenerale({ data }) {
  const { camions, chauffeurs, voyages } = data
  const enService = camions.filter((c) => c.etat === 'En service').length
  const dispos = chauffeurs.filter((c) => c.statut === 'Disponible').length
  const tonnes = voyages.reduce((sum, v) => sum + Number(v.tonnes || 0), 0)
  const series = tonnageParMois(voyages)

  return (
    <>
      <div className="kpis">
        <Carte label="Camions en service" valeur={enService} note={`sur ${camions.length} véhicules`} />
        <Carte label="Chauffeurs" valeur={chauffeurs.length} note={`${dispos} disponibles`} />
        <Carte label="Voyages" valeur={voyages.length} note="enregistrés" accent="gold" />
        <Carte
          label="Tonnage livré"
          valeur={Math.round(tonnes).toLocaleString('fr-FR')}
          unite=" t"
          note="cumul"
          accent="gold"
        />
      </div>

      <div className="panels">
        <section className="panel">
          <header className="panel__head">
            <h2>Tonnage par mois</h2>
            <span>en tonnes</span>
          </header>
          {series ? <Graphique series={series} /> : <Vide>Pas encore assez de voyages pour un historique.</Vide>}
        </section>

        <section className="panel">
          <header className="panel__head">
            <h2>Derniers voyages</h2>
            <span>{voyages.length} au total</span>
          </header>
          {voyages.length === 0 ? (
            <Vide>Aucun voyage enregistré.</Vide>
          ) : (
            <ul className="feed">
              {voyages.slice(0, 5).map((v) => (
                <li key={`${v.date}-${v.camion}-${v.trajet}`}>
                  <span className="feed__date">{formatDate(v.date)}</span>
                  <span className="feed__main">
                    <strong>{v.trajet}</strong>
                    <small>
                      {v.chauffeur} · {v.camion}
                    </small>
                  </span>
                  <span className="feed__tonnes">{Number(v.tonnes).toLocaleString('fr-FR')} t</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}

function CamionsView({ camions }) {
  return (
    <section className="panel panel--table">
      <header className="panel__head">
        <h2>Fiches camions</h2>
        <span>{camions.length} véhicules</span>
      </header>
      {camions.length === 0 ? (
        <Vide>Aucun camion enregistré.</Vide>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Immatriculation</th>
                <th>Modèle</th>
                <th>Année</th>
                <th>Kilométrage</th>
                <th>État</th>
              </tr>
            </thead>
            <tbody>
              {camions.map((c) => (
                <tr key={c.id}>
                  <td className="td-strong">{c.id}</td>
                  <td>{c.modele}</td>
                  <td>{c.annee}</td>
                  <td>{Number(c.km || 0).toLocaleString('fr-FR')} km</td>
                  <td>
                    <span className={`badge ${c.etat === 'En service' ? 'badge--ok' : 'badge--warn'}`}>
                      {c.etat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function ChauffeursView({ chauffeurs }) {
  return (
    <section className="panel panel--table">
      <header className="panel__head">
        <h2>Fiches chauffeurs</h2>
        <span>{chauffeurs.length} personnes</span>
      </header>
      {chauffeurs.length === 0 ? (
        <Vide>Aucun chauffeur enregistré.</Vide>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Permis</th>
                <th>Téléphone</th>
                <th>Camion affecté</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {chauffeurs.map((c) => (
                <tr key={c.id ?? c.nom}>
                  <td className="td-strong">{c.nom}</td>
                  <td>{c.permis}</td>
                  <td>{c.tel}</td>
                  <td>{c.camion}</td>
                  <td>
                    <span className={`badge ${c.statut === 'En arrêt' ? 'badge--off' : 'badge--ok'}`}>
                      {c.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

const MATERIAUX = [
  'Sable 0/4',
  'Sable 0/8',
  'Gravier 8/15',
  'Gravier 15/25',
  '1/500',
  '1/3T',
  '25/40',
  'Enrochement',
  'Remblais',
  'Déblais',
]

function VoyageForm({ camions, chauffeurs, onClose, onSaved }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    camion: camions[0]?.id ?? '',
    chauffeur: chauffeurs[0]?.nom ?? '',
    materiaux: MATERIAUX[0],
    trajet: '',
    bl_casa: '',
    bl_transport: '',
    saisie_par: 'Gérant',
    infraction: 'Aucune',
    tonnes: '',
  })
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function champ(nom, valeur) {
    setForm((actuel) => ({ ...actuel, [nom]: valeur }))
  }

  async function submit(event) {
    event.preventDefault()
    if (!form.camion || !form.chauffeur || !form.trajet.trim() || !(Number(form.tonnes) > 0)) {
      setErreur('Complétez tous les champs — le tonnage doit être supérieur à 0.')
      return
    }
    setEnvoi(true)
    setErreur('')

    const resultat = await ajouterVoyage(form)
    if (!resultat.ok) {
      setErreur(resultat.error)
      setEnvoi(false)
      return
    }
    onSaved()
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="titre-voyage">
      <button type="button" className="modal__fond" aria-label="Fermer" onClick={onClose} />
      <form className="modal__panel" onSubmit={submit}>
        <header className="modal__head">
          <h2 id="titre-voyage">Nouveau voyage</h2>
          <button type="button" className="modal__fermer" onClick={onClose} aria-label="Fermer la fenêtre">
            ×
          </button>
        </header>

        <div className="form-grid">
          <label>
            Date
            <input type="date" value={form.date} onChange={(e) => champ('date', e.target.value)} required />
          </label>
          <label>
            Camion
            <select value={form.camion} onChange={(e) => champ('camion', e.target.value)}>
              {camions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}
                </option>
              ))}
            </select>
          </label>
          <label>
            Chauffeur
            <select value={form.chauffeur} onChange={(e) => champ('chauffeur', e.target.value)}>
              {chauffeurs.map((c) => (
                <option key={c.nom} value={c.nom}>
                  {c.nom}
                </option>
              ))}
            </select>
          </label>
          <label>
            Matériau
            <select value={form.materiaux} onChange={(e) => champ('materiaux', e.target.value)}>
              {MATERIAUX.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="form-grid__large">
            Trajet
            <input
              type="text"
              placeholder="Bizerte → Mateur"
              value={form.trajet}
              onChange={(e) => champ('trajet', e.target.value)}
              required
            />
          </label>
          <label>
            N° BL Casa
            <input
              type="text"
              placeholder="ex. 1245/2026"
              value={form.bl_casa}
              onChange={(e) => champ('bl_casa', e.target.value)}
            />
          </label>
          <label>
            N° BL LA Transport
            <input
              type="text"
              placeholder="ex. LT-0891"
              value={form.bl_transport}
              onChange={(e) => champ('bl_transport', e.target.value)}
            />
          </label>
          <label>
            Saisie par
            <input
              type="text"
              placeholder="Nom de la personne"
              value={form.saisie_par}
              onChange={(e) => champ('saisie_par', e.target.value)}
            />
          </label>
          <label>
            Infraction
            <select value={form.infraction} onChange={(e) => champ('infraction', e.target.value)}>
              <option>Aucune</option>
              <option>Police</option>
              <option>Garde Nationale</option>
            </select>
          </label>
          <label>
            Tonnage (t)
            <input
              type="number"
              step="0.1"
              min="0"
              inputMode="decimal"
              placeholder="26.4"
              value={form.tonnes}
              onChange={(e) => champ('tonnes', e.target.value)}
              required
            />
          </label>
        </div>

        {erreur && (
          <p className="modal__erreur" role="alert">
            {erreur}
          </p>
        )}

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="btn btn--solid" disabled={envoi}>
            {envoi ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}

function VoyagesView({ voyages, camions, chauffeurs, onAjout }) {
  const [ouvert, setOuvert] = useState(false)
  const [succes, setSucces] = useState('')
  const total = voyages.reduce((sum, v) => sum + Number(v.tonnes || 0), 0)

  useEffect(() => {
    if (!succes) return undefined
    const minuteur = window.setTimeout(() => setSucces(''), 4000)
    return () => window.clearTimeout(minuteur)
  }, [succes])

  return (
    <section className="panel panel--table">
      <header className="panel__head">
        <h2>Voyages</h2>
        <div className="panel__outils">
          <span>
            {voyages.length} voyages · {Math.round(total).toLocaleString('fr-FR')} t
          </span>
          <button type="button" className="btn btn--solid btn--petit" onClick={() => setOuvert(true)}>
            + Nouveau voyage
          </button>
        </div>
      </header>

      {succes && (
        <p className="panel__succes" role="status">
          {succes}
        </p>
      )}

      {voyages.length === 0 ? (
        <Vide>Aucun voyage enregistré.</Vide>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Camion</th>
                <th>Chauffeur</th>
                <th>Infraction</th>
                <th>Matériau</th>
                <th>Trajet</th>
                <th>N° BL Casa</th>
                <th>N° BL LT</th>
                <th>Tonnage</th>
              </tr>
            </thead>
            <tbody>
              {voyages.map((v, i) => (
                <tr key={v.id ?? `${v.date}-${v.camion}-${i}`}>
                  <td>{formatDate(v.date)}</td>
                  <td className="td-strong">{v.camion}</td>
                  <td>{v.chauffeur}</td>
                  <td>{v.infraction || '—'}</td>
                  <td>{v.materiaux}</td>
                  <td>{v.trajet}</td>
                  <td>{v.bl_casa || '—'}</td>
                  <td>{v.bl_transport || '—'}</td>
                  <td className="td-num">{Number(v.tonnes).toLocaleString('fr-FR')} t</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {ouvert && (
        <VoyageForm
          camions={camions}
          chauffeurs={chauffeurs}
          onClose={() => setOuvert(false)}
          onSaved={async () => {
            setOuvert(false)
            setSucces('Voyage enregistré ✅')
            await onAjout()
          }}
        />
      )}
    </section>
  )
}

/* ---------- Tableau de bord ---------- */

export function Dashboard({ onLogout }) {
  const [vue, setVue] = useState('vue')
  const [data, setData] = useState(null)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    let actif = true
    loadDashboardData()
      .then((resultat) => actif && setData(resultat))
      .catch(() => actif && setErreur('Impossible de charger les données.'))
    return () => {
      actif = false
    }
  }, [])

  const aujourdhui = useMemo(
    () =>
      new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    [],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [vue])

  const demo = modeDemo || (data && data.source !== 'supabase')

  return (
    <div className="app">
      <aside className="app__side">
        <a className="app__brand" href="#top">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" width="40" height="34" />
          <span>LA Transport</span>
        </a>

        <p className="app__side-label">Espace gérant</p>

        <nav className="app__nav" aria-label="Navigation du tableau de bord">
          {vues.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`app__nav-item${vue === item.id ? ' is-active' : ''}`}
              onClick={() => setVue(item.id)}
              aria-current={vue === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="app__side-foot">
          <p className="app__user">
            <strong>Mohamed Ben Lakhel</strong>
            <span>Gérant</span>
          </p>
          <button type="button" className="app__logout" onClick={onLogout}>
            Se déconnecter
          </button>
          <a className="app__site" href="#top">
            ← Retour au site
          </a>
        </div>
      </aside>

      <div className="app__main">
        <header className="app__top">
          <div>
            <p className="app__crumb">Tableau de bord</p>
            <h1>Bonjour Chef</h1>
          </div>
          <p className="app__date">{aujourdhui}</p>
        </header>

        {demo && (
          <p className="app__bandeau">Mode démonstration — données fictives tant que la base n’est pas branchée.</p>
        )}
        {erreur && (
          <p className="app__bandeau app__bandeau--erreur" role="alert">
            {erreur}
          </p>
        )}

        <div className="app__content">
          {!data && !erreur && <p className="vide">Chargement…</p>}
          {data && vue === 'vue' && <VueGenerale data={data} />}
          {data && vue === 'camions' && <CamionsView camions={data.camions} />}
          {data && vue === 'chauffeurs' && <ChauffeursView chauffeurs={data.chauffeurs} />}
          {data && vue === 'voyages' && (
            <VoyagesView
              voyages={data.voyages}
              camions={data.camions}
              chauffeurs={data.chauffeurs}
              onAjout={async () => {
                const frais = await loadDashboardData()
                setData(frais)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
