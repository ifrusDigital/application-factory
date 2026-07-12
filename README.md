# AWID V1 Test Candidate

Projet Flutter intégré pour tester la base fonctionnelle actuelle d'AWID.

## Démarrage rapide

```bash
cd /workspaces/AWID_V1_TEST_CANDIDATE
chmod +x scripts/*.sh
./scripts/bootstrap.sh

export SUPABASE_URL="https://VOTRE-PROJET.supabase.co"
export SUPABASE_PUBLISHABLE_KEY="VOTRE_CLE_PUBLISHABLE"

./scripts/run_web.sh
```

Documentation :
- `docs/INSTALLATION_COMPLETE.md`
- `docs/CHECKLIST_TESTS.md`
- `docs/RECETTE_100_POURCENT.md`

## État réel

Ce paquet intègre et permet de tester :
- authentification et rôles ;
- campagnes Transporteur ;
- recherche et fiche Client ;
- contacts téléphone / WhatsApp.

Il ne prétend pas inclure les modules encore non développés : demandes d'envoi, colis, preuves, notifications, abonnements, administration et publication stores.

## Base unique

À partir de cette archive, ne remplacez plus le dossier `lib` par d'anciens ZIP. Toutes les corrections doivent être appliquées sur cette base uniquement.
