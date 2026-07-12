# AWID — Jalon 22 % : Recherche Client

## Avancement
- Avant validation : 21 %
- Après validation complète : 22 %

## Fonctionnalités
- Recherche par ville de collecte en France
- Filtre par wilaya de destination
- Filtre par date de départ du bateau
- Liste des campagnes disponibles
- Comparaison du prix minimum
- Fiche détaillée de la campagne
- Appel direct du transporteur
- Ouverture de WhatsApp

## Installation

1. Sauvegarder le dossier actuel :

```bash
cd /workspaces/awid13-1783707340120
mv lib lib_avant_jalon22
```

2. Copier depuis ce ZIP :
- `lib`
- `pubspec.yaml`

3. Remettre les clés dans :
- `lib/core/supabase_config.dart`

4. Lancer :

```bash
flutter pub get
fuser -k 8082/tcp || true
flutter run -d web-server --web-hostname 0.0.0.0 --web-port 8082
```

## Test
- Se connecter comme Client
- Vérifier qu'une campagne apparaît
- Filtrer par ville
- Filtrer par wilaya
- Ouvrir la fiche détaillée
- Tester les boutons Appeler et WhatsApp
