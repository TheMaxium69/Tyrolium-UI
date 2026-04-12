# 🎨 Tyrolium-UI : Documentation Technique & Design System

**Version :** 0.1.0-beta  
**Framework :** Angular (Workspace)  
**Iconographie :** RemixIcon  

---

## 📖 1. Présentation

**Tyrolium-UI** est la librairie de composants officielle du Design System de Tyrolium. 
Elle centralise l'identité visuelle pour l'ensemble des projets du groupe (Tyrolium, SolidServ, etc.).

## ⚙️ 2. Dépendances et Installation

La librairie s'appuie sur **RemixIcon** et des polices Google Fonts pour la gestion de ses icônes.

### A. Installation (à la racine du workspace)
`npm install remixicon`

### B. Configuration de l'application cliente
Dans le fichier de style global de l'application (ex: `styles.scss`), ajoutez l'import suivant tout en haut :
`@import 'remixicon/fonts/remixicon.css';`
`@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');;`

## 💅 3. Styles Globaux & Utilitaires

La librairie embarque des classes CSS globales réutilisables (ex: couleurs, flexbox, etc.). 
Pour que votre application puisse les utiliser, vous **ne devez pas** faire de `@import` dans vos fichiers CSS.

Vous devez déclarer le fichier de style de la librairie directement dans le fichier **`angular.json`** à la racine du workspace, dans la section `architect > build > options > styles` de votre application :

`"styles": [`
  `"projects/tyrolium-ui/src/styles/tyrolium-ui.css",`
  `"projects/tyrolium-website/src/styles.css"`
`]`

## 🏷️ 4. Conventions de nommage (Standard Tyrolium)

Pour garantir la clarté entre les différents projets, nous utilisons le préfixe **"TyroUi"** (Tyrolium UI).

### A. Composants TypeScript
* **Format :** PascalCase
* **Convention :** `TyroUi[Nom]`
* **Exemple :** `export class TyroUiButton`

### B. Sélecteurs HTML
* **Format :** kebab-case
* **Convention :** `<tyro-ui-[nom]>`
* **Exemple :** `<tyro-ui-button></tyro-ui-button>`

## 🛠️ 5. Guide de développement (Ajouter un composant)

### A. Génération
Utilisez toujours le flag `--project` pour cibler la librairie :
`ng generate component components/nom-composant --project=tyrolium-ui`

### B. Exportation (Indispensable)
Tout nouveau composant créé est privé par défaut. Il doit obligatoirement être déclaré dans le fichier `projects/tyrolium-ui/src/public-api.ts`.

**Exemple :**
`export * from './lib/components/button/button';`

## 🚀 6. Configuration du Workspace (Développement)

Pour bénéficier du rechargement automatique (Hot Reload) sans avoir à compiler la librairie à chaque modification visuelle, assurez-vous que le fichier `tsconfig.json` à la racine pointe directement vers les sources de l'API publique :

`"paths": {`
  `"tyrolium-ui": [`
    `"./projects/tyrolium-ui/src/public-api.ts"`
  `]`
`}`

## 💡 7. Utilisation dans une application

1. **Importer** le composant dans le fichier `.ts` du site cible :
   `import { TyroUiButton } from 'tyrolium-ui';`
2. **Déclarer** le composant dans le tableau `imports` du décorateur `@Component`.
3. **Utiliser** le sélecteur dans le template HTML : `<tyro-ui-button></tyro-ui-button>`.

---
*Document créé et maintenu par Maxime Tournier.*
