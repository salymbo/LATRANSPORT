import { useEffect, useState } from 'react'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#secteurs', label: 'Secteurs' },
  { href: '#entreprise', label: 'Entreprise' },
  { href: '#contact', label: 'Contact' },
]

const stats = [
  { value: '12', label: 'ans d’activité' },
  { value: '18', label: 'camions bennes' },
  { value: '45k', label: 'tonnes par an' },
  { value: '98 %', label: 'délais tenus' },
]

const services = [
  {
    index: '01',
    title: 'Transport en vrac',
    text: 'Sable, gravier, enrochement, remblais : chargement en carrière et livraison sur chantier, avec bon de transport à chaque rotation.',
    items: ['Bennes 8×4 & semi-remorques', 'Chargement mécanique', 'Livraison sur chantier'],
  },
  {
    index: '02',
    title: 'Logistique de chantier',
    text: 'Nous planifions les rotations, les horaires et les accès pour que votre chantier ne s’arrête jamais.',
    items: ['Planification des tournées', 'Accès & autorisations', 'Suivi des livraisons'],
  },
  {
    index: '03',
    title: 'Location avec chauffeur',
    text: 'Une benne et son chauffeur à la journée ou à la semaine, pour absorber vos pics d’activité.',
    items: ['Mise à disposition', 'Chauffeurs qualifiés', 'Facturation simple'],
  },
]

const secteurs = [
  { name: 'Sable & gravier', usage: 'Carrières', tag: '0/4 – 20/40', tone: 'A' },
  { name: 'Enrochement', usage: 'Ouvrages maritimes', tag: '1/3 T', tone: 'B' },
  { name: 'Remblais & déblais', usage: 'Terrassement', tag: '24 t', tone: 'C' },
  { name: 'Matériaux de construction', usage: 'Négoce', tag: '8×4', tone: 'D' },
]

const tickerWords = [
  'Sable',
  'Gravier',
  'Enrochement',
  'Remblais',
  'Déblais',
  'Location benne',
]

function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-in'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

function Header({ menuOpen, onToggle }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="shell header__inner">
        <a className="brand" href="#top" aria-label="LA Transport — accueil">
          <img className="brand__logo" src="/logo.png" alt="" width="44" height="37" />
          <span className="brand__name">LA Transport</span>
        </a>

        <nav className="nav" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav__link">
              {link.label}
            </a>
          ))}
        </nav>

        <a className="btn btn--solid header__cta" href="#contact">
          Demander un devis
        </a>

        <button
          type="button"
          className="burger"
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={onToggle}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="menu-mobile" className={`menu${menuOpen ? ' is-open' : ''}`} hidden={!menuOpen}>
        <nav aria-label="Navigation mobile">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="menu__link" onClick={onToggle}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--solid" href="#contact" onClick={onToggle}>
          Demander un devis
        </a>
        <p className="menu__meta">Bizerte · Tunisie</p>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="shell hero__grid">
        <div className="hero__copy">
          <p className="eyebrow" data-reveal>
            Transport routier · Tunisie
          </p>
          <h1 className="hero__title" data-reveal>
            Le transport
            <br />
            qui <em>tient</em>
            <br />
            la route.
          </h1>
          <p className="hero__lead" data-reveal>
            LA Transport déplace sable, gravier, enrochement et remblais partout en Tunisie.
            Des bennes entretenues, des chauffeurs expérimentés, des délais annoncés et tenus.
          </p>
          <div className="hero__actions" data-reveal>
            <a className="btn btn--solid" href="#contact">
              Demander un devis
            </a>
            <a className="btn btn--ghost" href="#services">
              Nos services
            </a>
          </div>
          <ul className="hero__stats" data-reveal>
            {stats.map((stat) => (
              <li key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__visual" data-reveal>
          <span className="hero__disc" aria-hidden="true" />
          <img
            className="hero__logo"
            src="/logo.png"
            alt="Logo LA Transport — camion benne"
            width="300"
            height="254"
          />
          <span className="hero__tag">24 t · charge utile</span>
          <span className="hero__badge">Depuis 2012</span>
        </div>
      </div>
    </section>
  )
}

function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[0, 1].map((copy) => (
          <ul className="ticker__list" key={copy}>
            {tickerWords.map((word) => (
              <li key={`${copy}-${word}`}>
                {word}
                <span className="ticker__dot" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

function Services() {
  return (
    <section className="section" id="services">
      <div className="shell">
        <div className="section__head">
          <p className="eyebrow" data-reveal>
            Nos services
          </p>
          <h2 className="section__title" data-reveal>
            Charger, livrer, recommencer. Sans retard.
          </h2>
        </div>

        <div className="services">
          {services.map((service) => (
            <article className="service" key={service.index} data-reveal>
              <span className="service__index">{service.index}</span>
              <h3 className="service__title">{service.title}</h3>
              <p className="service__text">{service.text}</p>
              <ul className="service__list">
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Secteurs() {
  return (
    <section className="section section--tinted" id="secteurs">
      <div className="shell">
        <div className="section__head section__head--split">
          <div>
            <p className="eyebrow" data-reveal>
              Secteurs
            </p>
            <h2 className="section__title" data-reveal>
              Ce que nous transportons
            </h2>
          </div>
          <p className="section__note" data-reveal>
            Du sable de carrière à l’enrochement, en passant par les remblais de chantier.
          </p>
        </div>

        <div className="projects">
          {secteurs.map((item) => (
            <article className={`project project--${item.tone}`} key={item.name} data-reveal>
              <div className="project__media" aria-hidden="true">
                <span className="project__glyph">{item.name.charAt(0)}</span>
              </div>
              <div className="project__caption">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.usage}</p>
                </div>
                <span className="project__year">{item.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Entreprise() {
  return (
    <section className="section" id="entreprise">
      <div className="shell studio">
        <div className="studio__copy">
          <p className="eyebrow" data-reveal>
            L’entreprise
          </p>
          <h2 className="section__title" data-reveal>
            Une entreprise familiale, une flotte tenue.
          </h2>
          <p className="studio__text" data-reveal>
            Depuis 2012, LA Transport travaille avec les carrières, les négoces de matériaux et
            les entreprises de travaux publics. Mohamed Ben Lakhel et son équipe conduisent
            eux-mêmes la plupart des tournées : un interlocuteur unique, joignable, qui connaît
            vos chantiers.
          </p>
          <p className="studio__text" data-reveal>
            Nos bennes sont révisées tous les 15 000 km, les chargements arrimés selon les règles
            de l’art, et chaque livraison est confirmée par un bon de transport.
          </p>
          <a className="link-arrow" href="#contact" data-reveal>
            Parler de votre chantier
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <figure className="studio__quote" data-reveal>
          <blockquote>
            « Un camion en retard, c’est un chantier à l’arrêt. Nous livrons à l’heure. »
          </blockquote>
          <figcaption>Mohamed Ben Lakhel — fondateur</figcaption>
        </figure>
      </div>
    </section>
  )
}

function Contact() {
  const [status, setStatus] = useState('idle')

  function handleSubmit(event) {
    event.preventDefault()
    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 700)
  }

  return (
    <section className="section section--dark" id="contact">
      <div className="shell contact">
        <div className="contact__intro">
          <p className="eyebrow eyebrow--light" data-reveal>
            Contact
          </p>
          <h2 className="section__title" data-reveal>
            Un devis en 24 h.
          </h2>
          <p className="contact__lead" data-reveal>
            Dites-nous ce que vous transportez, d’où et vers où. Réponse le jour ouvré suivant,
            prix à la tonne ou à la rotation.
          </p>
          <dl className="contact__details" data-reveal>
            <div>
              <dt>Dépôt</dt>
              <dd>Zone industrielle — Bizerte</dd>
            </div>
            <div>
              <dt>Écrire</dt>
              <dd>
                <a href="mailto:contact@latransport.tn">contact@latransport.tn</a>
              </dd>
            </div>
            <div>
              <dt>Appeler</dt>
              <dd>
                <a href="tel:+21600000000">+216 00 000 000</a>
              </dd>
            </div>
          </dl>
        </div>

        <form className="form" onSubmit={handleSubmit} data-reveal>
          <div className="field">
            <label htmlFor="name">Nom</label>
            <input id="name" name="name" type="text" autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="phone">Téléphone</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required />
          </div>
          <div className="field field--full">
            <label htmlFor="materiau">Matériau à transporter</label>
            <select id="materiau" name="materiau" defaultValue="">
              <option value="" disabled>
                Choisir un matériau
              </option>
              <option>Sable</option>
              <option>Gravier</option>
              <option>Enrochement</option>
              <option>Remblais / déblais</option>
              <option>Location de benne</option>
              <option>Autre</option>
            </select>
          </div>
          <div className="field field--full">
            <label htmlFor="message">Votre chantier</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Départ, destination, tonnage estimé, date souhaitée…"
              required
            />
          </div>

          <button className="btn btn--accent field--full" type="submit" disabled={status !== 'idle'}>
            {status === 'idle' && 'Demander un devis'}
            {status === 'sending' && 'Envoi…'}
            {status === 'sent' && 'Demande envoyée ✓'}
          </button>

          {status === 'sent' && (
            <p className="form__note" role="status">
              Merci ! Ceci est une démonstration : aucun message n’a été envoyé.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <a className="brand brand--footer" href="#top">
          <img className="brand__logo brand__logo--footer" src="/logo.png" alt="LA Transport" />
        </a>

        <p className="footer__copy">
          LA Transport — Mohamed Ben Lakhel.
          <br />© {new Date().getFullYear()} Tous droits réservés. Modèle de démonstration.
        </p>

        <div className="footer__links">
          <a href="#services">Services</a>
          <a href="#secteurs">Secteurs</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  useReveal()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <a className="skip" href="#main">
        Aller au contenu
      </a>
      <Header menuOpen={menuOpen} onToggle={() => setMenuOpen((open) => !open)} />
      <main id="main">
        <Hero />
        <Ticker />
        <Services />
        <Secteurs />
        <Entreprise />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
