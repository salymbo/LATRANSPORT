# LA Transport — site vitrine

Site one-page pour **LA Transport** (Mohamed Ben Lakhel) : transport de matériaux en bennes,
logistique de chantier et location avec chauffeur.

Stack : **React + Vite**, site statique (aucun serveur nécessaire).

## Démarrer

```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

## Mettre en ligne

```bash
npm run build      # génère dist/
```

- **Netlify** : glisser le dossier `dist` sur https://app.netlify.com/drop
- **Vercel** : importer le projet (build : `npm run build`, sortie : `dist`)
- Ou tout hébergement statique (OVH, Hostinger, GitHub Pages…)

## Où modifier le contenu

| Quoi | Où |
| --- | --- |
| Nom, navigation | `src/App.jsx` — `navLinks`, header |
| Chiffres clés (12 ans, 18 camions…) | `src/App.jsx` — `stats` |
| Services | `src/App.jsx` — `services` |
| Secteurs / matériaux | `src/App.jsx` — `secteurs` |
| Bandeau défilant | `src/App.jsx` — `tickerWords` |
| Textes hero, entreprise, contact | `src/App.jsx` — `Hero`, `Entreprise`, `Contact` |
| Couleurs, polices, espacements | `src/styles.css` — variables `:root` |
| Titre / description SEO | `index.html` |
| Logo | `public/logo.png` (généré depuis `Logo.png`) |

### Remplacer le logo

Déposer le nouveau logo à la racine sous le nom `Logo.png` (fond blanc), puis :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/make-logo.ps1
```

Le script détoure le fond blanc, recadre et réécrit `public/logo.png`.

## À confirmer / compléter

Ces éléments sont des **placeholders** à remplacer par les vraies informations :

- [ ] Téléphone (`+216 00 000 000`) et e-mail (`contact@latransport.tn`)
- [ ] Adresse du dépôt (actuellement « Zone industrielle — Bizerte »)
- [ ] Chiffres clés (12 ans, 18 camions, 45k tonnes, 98 %)
- [ ] Liste exacte des services et des matériaux transportés
- [ ] Photos de la flotte / chantiers (dossier `public/`)
- [ ] Brancher le formulaire (Formspree, Netlify Forms ou API)
- [ ] Mentions légales

## Structure

```
site/
├── index.html              # SEO, polices, favicon
├── public/
│   ├── logo.png            # logo détouré (fond transparent)
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx             # contenu + composants
│   └── styles.css          # design system
├── scripts/
│   ├── make-logo.ps1       # détourage / recadrage du logo
│   └── shot.mjs            # captures desktop + mobile + test de débordement
└── shots/                  # captures générées (non versionnées)
```

## Vérifier le rendu

```bash
node scripts/shot.mjs
```

Génère `shots/desktop.png`, `shots/mobile.png`, `shots/mobile-menu.png` et signale
tout élément qui dépasse la largeur de l'écran.
