import { useEffect, useMemo, useState } from 'react'
import './dashboard.css'

export const AUTH_KEY = 'latransport-session'
const DEMO_USER = 'gerant'
const DEMO_PASS = 'latransport2026'

const camions = [
  { id: 'LT-214-TN', modele: 'Mercedes Atego 8×4', annee: 2019, km: 248500, etat: 'En service' },
  { id: 'LT-318-TN', modele: 'Renault K 440', annee: 2021, km: 186300, etat: 'En service' },
  { id: 'LT-402-TN', modele: 'MAN TGS 33.400', annee: 2018, km: 312800, etat: 'En atelier' },
  { id: 'LT-455-TN', modele: 'Volvo FMX 460', annee: 2022, km: 97400, etat: 'En service' },
  { id: 'LT-509-TN', modele: 'Scania G410', annee: 2020, km: 204100, etat: 'En service' },
]

const chauffeurs = [
  { nom: 'Mohamed Ben Lakhel', permis: 'C', tel: '98 214 553', camion: 'LT-214-TN', statut: 'Gérant' },
  { nom: 'Karim Trabelsi', permis: 'CE', tel: '22 431 087', camion: 'LT-318-TN', statut: 'Disponible' },
  { nom: 'Sofiane Gharbi', permis: 'C', tel: '44 902 611', camion: 'LT-402-TN', statut: 'En arrêt' },
  { nom: 'Hichem Zouari', permis: 'CE', tel: '31 775 420', camion: 'LT-455-TN', statut: 'En tournée' },
  { nom: 'Rania Ben Salah', permis: 'C', tel: '55 128 903', camion: 'LT-509-TN', statut: 'Disponible' },
]

const voyages = [
  { date: '24/11', camion: 'LT-214-TN', chauffeur: 'Karim Trabelsi', materiaux: 'Sable 0/4', trajet: 'Bizerte → Menzel Jemil', tonnes: 26.4 },
  { date: '24/11', camion: 'LT-455-TN', chauffeur: 'Hichem Zouari', materiaux: 'Gravier 8/15', trajet: 'Bizerte → Mateur', tonnes: 28.1 },
  { date: '23/11', camion: 'LT-509-TN', chauffeur: 'Rania Ben Salah', materiaux: 'Enrochement', trajet: 'Carrière → Port', tonnes: 24.8 },
  { date: '23/11', camion: 'LT-318-TN', chauffeur: 'Karim Trabelsi', materiaux: 'Remblais', trajet: 'Bizerte → Ras Jebel', tonnes: 27.3 },
  { date: '22/11', camion: 'LT-214-TN', chauffeur: 'Mohamed Ben Lakhel', materiaux: 'Sable 0/4', trajet: 'Bizerte → Sidi Bou Saïd', tonnes: 25.9 },
  { date: '22/11', camion: 'LT-509-TN', chauffeur: 'Rania Ben Salah', materiaux: 'Gravier 15/25', trajet: 'Bizerte → Tunis', tonnes: 29.2 },
  { date: '21/11', camion: 'LT-455-TN', chauffeur: 'Hichem Zouari', materiaux: 'Enrochement', trajet: 'Carrière → Port', tonnes: 24.6 },
  { date: '21/11', camion: 'LT-318-TN', chauffeur: 'Karim Trabelsi', materiaux: 'Remblais', trajet: 'Bizerte → Ghazala', tonnes: 27.9 },
]

const tonnageParMois = [
  { mois: 'Juin', tonnes: 780 },
  { mois: 'Juil', tonnes: 640 },
  { mois: 'Août', tonnes: 410 },
  { mois: 'Sept', tonnes: 860 },
  { mois: 'Oct', tonnes: 910 },
  { mois: 'Nov', tonnes: 942 },
]

const vues = [
  { id: 'vue', label: 'Vue générale' },
  { id: 'camions', label: 'Camions' },
  { id: 'chauffeurs', label: 'Chauffeurs' },
  { id: 'voyages', label: 'Voyages' },
]

function formatKm(km) {
  return `${km.toLocaleString('fr-FR')} km`
}

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

  function submit(event) {
    event.preventDefault()
    setEnvoi(true)
    setErreur('')
    window.setTimeout(() => {
      if (user.trim().toLowerCase() === DEMO_USER && pass === DEMO_PASS) {
        sessionStorage.setItem(AUTH_KEY, '1')
        onSuccess()
      } else {
        setErreur('Identifiant ou mot de passe incorrect.')
        setEnvoi(false)
      }
    }, 450)
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
            <label htmlFor="user">Identifiant</label>
            <input
              id="user"
              name="user"
              type="text"
              autoComplete="username"
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

          <button className="btn btn--solid auth__submit" type="submit" disabled={envoi}>
            {envoi ? 'Connexion…' : 'Se connecter'}
          </button>

          <p className="auth__demo">
            Démonstration : <code>gerant</code> / <code>latransport2026</code>
          </p>
        </form>
      </main>
    </div>
  )
}

/* ---------- Tableau de bord ---------- */

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

function VueGenerale() {
  const max = Math.max(...tonnageParMois.map((m) => m.tonnes))
  return (
    <>
      <div className="kpis">
        <Carte label="Camions en service" valeur="4" note="sur 5 véhicules" />
        <Carte label="Chauffeurs" valeur="5" note="3 disponibles" />
        <Carte label="Voyages ce mois" valeur="38" note="+12 % vs octobre" accent="gold" />
        <Carte label="Tonnage livré" valeur="942" unite=" t" note="novembre 2026" accent="gold" />
      </div>

      <div className="panels">
        <section className="panel">
          <header className="panel__head">
            <h2>Tonnage par mois</h2>
            <span>en tonnes</span>
          </header>
          <div className="chart" role="img" aria-label="Tonnage livré par mois, de juin à novembre 2026">
            {tonnageParMois.map((m) => (
              <div className="chart__col" key={m.mois}>
                <span className="chart__value">{m.tonnes}</span>
                <div className="chart__bar" style={{ height: `${Math.round((m.tonnes / max) * 100)}%` }} />
                <span className="chart__label">{m.mois}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <header className="panel__head">
            <h2>Derniers voyages</h2>
            <span>8 derniers</span>
          </header>
          <ul className="feed">
            {voyages.slice(0, 5).map((v) => (
              <li key={`${v.date}-${v.camion}-${v.trajet}`}>
                <span className="feed__date">{v.date}</span>
                <span className="feed__main">
                  <strong>{v.trajet}</strong>
                  <small>{v.chauffeur} · {v.camion}</small>
                </span>
                <span className="feed__tonnes">{v.tonnes.toLocaleString('fr-FR')} t</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

function CamionsView() {
  return (
    <section className="panel panel--table">
      <header className="panel__head">
        <h2>Fiches camions</h2>
        <span>{camions.length} véhicules</span>
      </header>
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
                <td>{formatKm(c.km)}</td>
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
    </section>
  )
}

function ChauffeursView() {
  return (
    <section className="panel panel--table">
      <header className="panel__head">
        <h2>Fiches chauffeurs</h2>
        <span>{chauffeurs.length} personnes</span>
      </header>
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
              <tr key={c.nom}>
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
    </section>
  )
}

function VoyagesView() {
  const total = voyages.reduce((sum, v) => sum + v.tonnes, 0)
  return (
    <section className="panel panel--table">
      <header className="panel__head">
        <h2>Voyages</h2>
        <span>
          {voyages.length} voyages · {total.toLocaleString('fr-FR')} t
        </span>
      </header>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Camion</th>
              <th>Chauffeur</th>
              <th>Matériau</th>
              <th>Trajet</th>
              <th>Tonnage</th>
            </tr>
          </thead>
          <tbody>
            {voyages.map((v) => (
              <tr key={`${v.date}-${v.camion}-${v.trajet}`}>
                <td>{v.date}</td>
                <td className="td-strong">{v.camion}</td>
                <td>{v.chauffeur}</td>
                <td>{v.materiaux}</td>
                <td>{v.trajet}</td>
                <td className="td-num">{v.tonnes.toLocaleString('fr-FR')} t</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function Dashboard({ onLogout }) {
  const [vue, setVue] = useState('vue')
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

        <div className="app__content">
          {vue === 'vue' && <VueGenerale />}
          {vue === 'camions' && <CamionsView />}
          {vue === 'chauffeurs' && <ChauffeursView />}
          {vue === 'voyages' && <VoyagesView />}
        </div>
      </div>
    </div>
  )
}
