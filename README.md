# LA Transport — site vitrine

Site one-page pour **LA Transport** (Mohamed Ben Lakhel) : transport de matériaux en bennes,
logistique de chantier et location avec chauffeur.

Stack : **React + Vite**, site statique (aucun serveur nécessaire).

## Démarrer

```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

## Espace gérant (démo)

Le lien **Espace gérant** (menu + pied de page) mène à une page de connexion, puis à un
tableau de bord : camions, chauffeurs, voyages, tonnages.

| Identifiant | Mot de passe |
| --- | --- |
| `gerant` | `latransport2026` |

- Identifiants définis dans [`src/Dashboard.jsx`](src/Dashboard.jsx) (`DEMO_USER`, `DEMO_PASS`)
- Session en `sessionStorage` : elle se ferme avec l'onglet
- L'accès direct à `#/dashboard` sans session renvoie vers la connexion

> ⚠️ **Ce n'est pas une sécurité réelle.** Sur un site statique, le mot de passe et les
> données sont dans le code téléchargé par le navigateur : n'importe qui peut les lire.
> Pour de vrais accès (données de la société, plusieurs utilisateurs), il faut un serveur
> d'authentification — voir « Sécuriser l'espace gérant » ci-dessous.

## Sécuriser l'espace gérant (prochaine étape)

Solution recommandée : **Supabase** (gratuit pour ce volume).

1. Créer un projet Supabase, une table `camions`, `chauffeurs`, `voyages`
2. Activer l'authentification par e-mail + mot de passe (un seul compte : le gérant)
3. Activer les règles RLS : lecture réservée aux utilisateurs connectés
4. Remplacer la vérification locale de `Dashboard.jsx` par `supabase.auth.signInWithPassword()`

Résultat : mot de passe haché côté serveur, données servies uniquement après connexion,
consultables depuis n'importe quel appareil.

## Mettre en ligne

### GitHub Pages (dépôt `salymbo/LATRANSPORT`)

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) construit et publie
le site à chaque `push` sur `main`.

**À faire une seule fois** (GitHub n'autorise pas le workflow à activer Pages lui-même) :

1. Ouvrir https://github.com/salymbo/LATRANSPORT/settings/pages
2. Section **Build and deployment** → **Source** : `GitHub Actions`
3. Onglet **Actions** → workflow *Deploy to GitHub Pages* → **Re-run all jobs**

Le site sera alors en ligne sur **https://salymbo.github.io/LATRANSPORT/**

À chaque `git push` sur `main`, le site se met à jour automatiquement (~1 min).

### Autres hébergeurs

```bash
npm run build      # génère dist/
```

- **Netlify** : glisser le dossier `dist` sur https://app.netlify.com/drop
- **Vercel** : importer le projet (build : `npm run build`, sortie : `dist`)
- Ou tout hébergement statique (OVH, Hostinger…) — dans ce cas, remettre
  `base: '/'` dans `vite.config.js` (la variable `GITHUB_ACTIONS` ne s'applique qu'en CI).

## Où modifier le contenu

| Quoi | Où |
| --- | --- |
| Nom, navigation | `src/App.jsx` — `navLinks`, header |
| Chiffres clés (12 ans, 18 camions…) | `src/App.jsx` — `stats` |
| Services | `src/App.jsx` — `services` |
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
