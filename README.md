# 🎨 Tyrolium-UI : Documentation Technique & Design System

**Framework :** Angular (Workspace mono-repo)
**Iconographie :** RemixIcon
**Documentation interactive :** [design.tyrolium.fr](https://design.tyrolium.fr)

---

## 📖 1. Présentation

**Tyrolium-UI** est la librairie de composants officielle du Design System de Tyrolium.
Elle centralise l'identité visuelle pour l'ensemble des projets du groupe.

### Projets du workspace

| Projet | URL | Description |
|---|---|---|
| `tyrolium-ui` | — | Librairie de composants (ce projet) |
| `tyrolium-website` | tyrolium.fr | Site principal |
| `tyrolium-design` | design.tyrolium.fr | Documentation du design system |
| `tyrolium-uptime` | — | Page de statut des serveurs |
| `solidserv-website` | solidserv.fr | Hébergeur de serveurs |
| `tyrociel-website` | tyrociel.fr | Studio de jeu-vidéo |
| `tyroserv-website` | tyroserv.fr | Serveur Minecraft |
| `influnias-website` | influnias.fr | Agence d'influenceurs |
| `vturias-website` | vturias.fr | Agence de VTubers |
| `gamenium-website` | gamenium.fr | Actualités jeu-vidéo |
| `useritium-website` | useritium.fr | Gestion de compte SSO |
| `nexiumiacrm-website` | nexiumiacrm.fr | CRM |
| `useritium-dashboard` | dashboard.useritium.fr | Dashboard Useritium |
| `tyrolium-hub` | hub.tyrolium.fr | Hub backoffice interne |

---

## ⚙️ 2. Dépendances et Installation

### A. Installation (à la racine du workspace)
```bash
npm install remixicon
```

### B. Polices (Google Fonts)
Dans le `<head>` de chaque `index.html` :
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+Display:wght@100..900&display=swap" rel="stylesheet">
```

| Famille | Usage |
|---|---|
| **Syne** | Titres et headings |
| **Inter** | Corps de texte et UI |
| **Noto Sans Display** | Sous-marques |

### C. Meta theme-color
Obligatoire dans chaque `index.html` pour que `TyroUiThemeService` mette à jour la couleur de l'onglet navigateur :
```html
<meta name="theme-color" content="#111827" />
```

---

## 💅 3. Styles Globaux

Ne pas faire `@import` dans les CSS. Déclarer le fichier global dans `angular.json` :

```json
"styles": [
  "node_modules/remixicon/fonts/remixicon.css",
  "projects/tyrolium-ui/src/styles/tyrolium-ui.css",
  "projects/mon-projet/src/styles.css"
]
```

---

## 🏷️ 4. Conventions de nommage (Standard Tyrolium)

### A. Composants TypeScript
- **Format :** PascalCase
- **Convention :** `TyroUi[Nom]`
- **Exemple :** `export class TyroUiButton`

### B. Sélecteurs HTML
- **Format :** kebab-case
- **Convention :** `<tyro-ui-[nom]>`
- **Exemple :** `<tyro-ui-button></tyro-ui-button>`

---

## 🛠️ 5. Ajouter un composant à la librairie

### A. Génération
```bash
ng generate component components/nom-composant --project=tyrolium-ui
```

### B. Exportation
Déclarer le composant dans `projects/tyrolium-ui/src/public-api.ts` :
```ts
export * from './lib/components/nom-composant/nom-composant';
```

---

## 🚀 6. Développement (Hot Reload)

Le `tsconfig.json` racine pointe directement vers les sources pour éviter de rebuilder la lib à chaque modification :

```json
"paths": {
  "tyrolium-ui": ["./projects/tyrolium-ui/src/public-api.ts"]
}
```

---

## 💡 7. Utilisation dans une application

```ts
import { TyroUiButton } from 'tyrolium-ui';

@Component({
  imports: [TyroUiButton],
  template: `<tyro-ui-button>Valider</tyro-ui-button>`
})
```

---

## 🔨 8. Build

```bash
# Librairie
ng build tyrolium-ui

# Site
ng build tyrolium-website
```

---

*Document maintenu par Maxime Tournier — [design.tyrolium.fr](https://design.tyrolium.fr)*
