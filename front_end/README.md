## RH Intelligent — Front-end

Application front-end basée sur React, Vite et TypeScript, avec Tailwind CSS, React Router, Zustand pour l'état, Chart.js pour les graphiques, et Vitest pour les tests.

### Prérequis
- **Node.js** ≥ 18 (recommandé: LTS)
- **npm** ≥ 9

Vérifier votre version:

```bash
node -v
npm -v
```

### Installation

Depuis le dossier `front_end`:

```bash
npm install
# ou, pour une installation stricte basée sur package-lock:
npm ci
```

### Démarrer le serveur de dev

```bash
npm run dev
```

Par défaut, l'application tourne sur `http://localhost:5173`.
Pour changer le port, modifiez `server.port` dans `vite.config.ts`.

### Scripts disponibles

- `npm run dev` : lance le serveur de développement Vite
- `npm run build` : compile TypeScript et construit la version de production dans `dist/`
- `npm run preview` : sert localement le build de production (`http://localhost:5173` par défaut)
- `npm test` : exécute la suite de tests avec Vitest

Exemples utiles:

```bash
# tests en mode watch
npm test -- --watch

# couverture de tests
npm test -- --coverage
```

### Structure du projet (src)

```text
src/
  App.tsx                # point d'entrée de l'app React
  main.tsx               # bootstrap React + Router
  styles.css             # styles globaux (Tailwind)
  components/
    layout/AppLayout.tsx # layout principal
    routing/RequireRole.tsx
    ui/Toaster.tsx       # notifications
  pages/
    auth/Login.tsx
    Dashboard.tsx
    Jobs.tsx
    Applications.tsx
    ApplicationDetail.tsx
    Users.tsx
    NotFound.tsx
  services/
    emailService.ts
    mockData.ts
    mockData.test.ts
  stores/
    authStore.ts
    notificationStore.ts
  utils/
    fileToText.ts
```

### Pile technique

- React 18, TypeScript, Vite 5
- React Router 6
- Tailwind CSS 3 (voir `tailwind.config.js` et `postcss.config.js`)
- Zustand pour l'état global
- Chart.js + `react-chartjs-2` pour les graphiques
- Vitest + Testing Library pour les tests

### Configuration et variables d'environnement

Le projet n'utilise actuellement aucune variable d'environnement. 
Si besoin, créez un fichier `.env` (ou `.env.local`) à la racine de `front_end/` et utilisez le préfixe `VITE_` pour qu'elles soient exposées au client, par ex.:

```env
VITE_API_BASE_URL=https://api.exemple.com
```

Puis récupérez-les dans le code via `import.meta.env.VITE_API_BASE_URL`.

### Build de production

```bash
npm run build
```

Les artefacts sont générés dans `dist/`. Servez le dossier `dist/` via un serveur statique (Nginx, Apache, Vercel, Netlify, GitHub Pages, etc.). Pour un test local rapide:

```bash
npm run preview
```

### Tests

Les tests unitaires et de composants utilisent Vitest + Testing Library.

```bash
npm test
```

Les fichiers de test peuvent se trouver aux côtés du code, ex. `services/mockData.test.ts`.

### Notes de développement

- Tailwind est déjà configuré; import des styles dans `src/styles.css`.
- La navigation est gérée par `react-router-dom` dans `main.tsx` et `App.tsx`.
- La gestion d'authentification/roles s'appuie sur `stores/authStore.ts` et `components/routing/RequireRole.tsx`.

### Dépannage

- Erreur de version Node: mettez à jour vers Node ≥ 18.
- Port occupé: changez `server.port` dans `vite.config.ts` ou lancez avec `--port`.
- Cache Vite corrompu: supprimez `node_modules/.vite` et relancez `npm run dev`.

### Licence

Ce projet est sous licence MIT (voir `LICENSE`).


