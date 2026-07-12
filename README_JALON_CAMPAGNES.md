# AWID — Jalon Campagnes de transport

## Avancement
- Avant validation : 20 %
- Après création et test complet du nouveau modèle : 22 %

## Ce qui est inclus
- Plusieurs villes de collecte en France
- Menus de sélection avec recherche
- Port de départ
- Port d’arrivée en Algérie
- Date et heure de départ du bateau
- Date et heure d’arrivée estimée
- Livraison nationale ou par wilayas
- Tarifs dégressifs par tranche de poids
- Téléphone, WhatsApp et adresse de contact
- Base Supabase normalisée

## Installation

1. Dans Supabase SQL Editor, exécuter :
   `sql/004_transport_campaigns.sql`

2. Copier les nouveaux fichiers dans le projet :
   - lib/models/reference_location.dart
   - lib/models/transport_campaign.dart
   - lib/services/campaign_service.dart
   - lib/widgets/multi_select_location_field.dart
   - lib/screens/transporter/campaign_form_screen.dart

3. Ajouter temporairement l’ouverture de l’écran depuis le tableau de bord :

```dart
Navigator.of(context).push(
  MaterialPageRoute(
    builder: (_) => const CampaignFormScreen(),
  ),
);
```

4. Tester la création d’une campagne.

## Checklist
- [ ] Plusieurs villes françaises sélectionnées
- [ ] Port de départ sélectionné
- [ ] Dates bateau enregistrées
- [ ] Port d’arrivée sélectionné
- [ ] Wilayas sélectionnées ou toute l’Algérie
- [ ] Plusieurs tranches de prix enregistrées
- [ ] Contact direct enregistré
- [ ] Données visibles dans les quatre tables Supabase
