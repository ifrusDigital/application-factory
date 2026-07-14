# AWID VD CLEAN

Base unique et propre pour la recette.

## Installation

```bash
cd /workspaces/AWID_VD_CLEAN
chmod +x scripts/*.sh
./scripts/bootstrap.sh
```

Dans Supabase :

```text
sql/001_install_all.sql
sql/002_storage.sql
```

Puis :

```bash
export SUPABASE_URL="https://VOTRE-PROJET.supabase.co"
export SUPABASE_PUBLISHABLE_KEY="VOTRE_CLE_PUBLISHABLE"
./scripts/run_web.sh
```
