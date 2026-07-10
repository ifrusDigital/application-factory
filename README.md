# Application Factory V1

Plateforme cloud en français pour transformer une idée en cahier des charges puis créer automatiquement un dépôt GitHub.

## Installation
1. Créer un projet Supabase.
2. Exécuter le SQL dans `supabase/migrations`.
3. Créer les deux Edge Functions depuis le tableau de bord Supabase.
4. Ajouter les secrets `GEMINI_API_KEY`, `GEMINI_MODEL`, `GITHUB_TOKEN`, `GITHUB_OWNER`.
5. Renseigner `config.js`.
6. Importer le projet dans GitHub.
7. Ajouter les secrets Cloudflare dans GitHub.

## Sécurité
La politique RLS est ouverte uniquement pour le premier test. Ajouter Supabase Auth avant une mise en production publique.
