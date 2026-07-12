# Application Factory — générateur universel IA

Cette version transforme n'importe quelle idée en cahier des charges complet sans modifier `app.js` pour chaque projet.

## Architecture

- Interface : Cloudflare Pages
- Base et fonction sécurisée : Supabase
- Intelligence artificielle : Gemini API
- Code et versions : GitHub

La clé Gemini reste dans les secrets Supabase et n'est jamais exposée dans le navigateur.

## Installation unique

1. Exécuter `001_application_factory.sql` dans Supabase SQL Editor.
2. Déployer `supabase/functions/analyze-project/index.ts` sous le nom `analyze-project`.
3. Ajouter le secret Supabase `GEMINI_API_KEY`. `GEMINI_MODEL` est facultatif.
4. Conserver l'URL et la clé publique Supabase dans `config.js`.
5. Publier les fichiers sur Cloudflare Pages.

## Déploiement automatique de la fonction

Le workflow `.github/workflows/deploy-edge-function.yml` fonctionne après ajout des secrets GitHub `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF` et `GEMINI_API_KEY`.

## Test d'acceptation

Décrire deux projets très différents. Vérifier que chaque cahier est spécifique et contient les 19 sections, les tables, les tests et les jalons jusqu'à 100 %. Vérifier ensuite qu'une ligne est enregistrée dans `projects`.

La création réelle du dépôt GitHub et la génération du code appartiennent au jalon suivant. Le bouton GitHub ouvre pour l'instant le formulaire prérempli.
