# ==============================================================================
# TYROLIUM-UI : DOCUMENTATION TECHNIQUE & DESIGN SYSTEM
# ==============================================================================
# Version : 1.0.0
# Framework : Angular (Workspace Monorepo)
# Iconographie : RemixIcon
# ==============================================================================

1. PRÉSENTATION
---------------
Tyrolium-UI est la librairie de composants officielle du Design System de Tyrolium. 
Elle centralise l'identité visuelle pour l'ensemble des projets du groupe 
(Tyrolium, SolidServ, etc.).

2. DÉPENDANCES ET INSTALLATION
------------------------------
La librairie s'appuie sur RemixIcon pour les icônes.

A. Installation (à la racine du workspace) :
   npm install remixicon

B. Configuration de l'application cliente :
   Dans le fichier de style global de l'application (ex: styles.scss), 
   ajoutez l'import suivant :
   
   @import 'remixicon/fonts/remixicon.css';

3. CONVENTIONS DE NOMMAGE (STANDARD TYROLIUM)
---------------------------------------------
Pour garantir la clarté entre les différents projets, nous utilisons le 
préfixe "TyroUi" (Tyrolium UI).

A. Composants TypeScript :
   - Format : PascalCase
   - Convention : TyroUi[Nom]
   - Exemple : export class TyroUiButton

B. Sélecteurs HTML :
   - Format : kebab-case
   - Convention : tyro-ui-[nom]
   - Exemple : <tyro-ui-button></tyro-ui-button>

4. GUIDE DE DÉVELOPPEMENT (AJOUTER UN COMPOSANT)
------------------------------------------------

A. Génération :
   ng generate component components/nom-composant --project=tyrolium-ui

B. Exportation (Indispensable) :
   Tout nouveau composant doit être déclaré dans :
   projects/tyrolium-ui/src/public-api.ts
   
   Exemple : export * from './lib/components/button/button.component';

5. CONFIGURATION DU WORKSPACE (DÉVELOPPEMENT)
---------------------------------------------
Pour bénéficier du rechargement automatique (Hot Reload) sans compiler la lib à 
chaque modification, le fichier `tsconfig.json` à la racine doit pointer 
directement vers les sources :

"paths": {
  "tyrolium-ui": ["./projects/tyrolium-ui/src/public-api.ts"]
}

6. UTILISATION DANS UNE APPLICATION
-----------------------------------
1. Importer le composant dans le fichier .ts du site :
   import { TyroUiButton } from 'tyrolium-ui';

2. L'ajouter dans le tableau 'imports' du décorateur @Component.

3. Utiliser le sélecteur dans le template HTML.

# ==============================================================================
# FIN DU DOCUMENT - TYROLIUM TECH TEAM
# ==============================================================================
