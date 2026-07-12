"use strict";

const $ = (id) => document.getElementById(id);
const nameInput = $("name");
const ideaInput = $("idea");
const langsInput = $("langs");
const analyzeButton = $("analyze");
const githubButton = $("github");
const copyButton = $("copy");
const statusBox = $("status");
const specBox = $("spec");
const errorBox = $("formError");

function slugify(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function detectFeatures(text) {
  const value = text.toLowerCase();
  const tests = [
    ["Géolocalisation et carte", /géolocal|gps|carte|proximité/],
    ["Réservations", /réserv|hôtel|hotel|voiture|transport|conciergerie/],
    ["Espace professionnel", /professionnel|partenaire|prestataire/],
    ["Back-office administrateur", /administr|back.office|gestion/],
    ["Contenus historiques et culturels", /histoire|culture|musée|monument|personnalité/],
    ["Paiement et monétisation", /paiement|abonnement|commission|annonce|monétis/],
    ["Notifications", /notification|alerte/],
    ["Mode hors connexion", /hors connexion|offline/]
  ];
  const found = tests.filter((item) => item[1].test(value)).map((item) => item[0]);
  return found.length ? found : ["Authentification", "Profils utilisateurs", "Tableau de bord", "Administration"];
}

function buildSpecification(projectName, idea, languages) {
  if (/ifru explore|touris|histoire|culture|géolocal/i.test(`${projectName} ${idea}`)) {
    return buildTourismSpecification(projectName, idea, languages);
  }
  const features = detectFeatures(idea);
  const list = features.map((feature) => `- ${feature}`).join("\n");
  return `CAHIER DES CHARGES — ${projectName.toUpperCase()}

1. VISION DU PROJET
${idea}

2. UTILISATEURS
- Visiteur ou client
- Professionnel ou partenaire
- Administrateur

3. LANGUES
${languages}

4. FONCTIONNALITÉS IDENTIFIÉES
${list}

5. SOCLE TECHNIQUE
- Interface web responsive et PWA
- Supabase : base PostgreSQL, authentification et stockage
- GitHub : code source et gestion des versions
- GitHub Actions : compilation et tests automatiques
- Cloudflare Pages : version en ligne
- Préparation Android et iPhone

6. LIVRABLES À GÉNÉRER
- Application utilisateur
- Espace professionnel
- Back-office administrateur
- Script SQL Supabase unique
- Règles de sécurité RLS
- Données de démonstration
- Tests automatiques
- Documentation d'installation et de publication

7. ÉTAPES
- Validation du cahier des charges
- Génération de la base
- Génération de l'application
- Connexion Supabase
- Tests fonctionnels
- Déploiement Preview
- Validation commerciale
- Publication Android et iPhone

Statut : ANALYSÉ — À VALIDER`;
}

function buildTourismSpecification(projectName, idea, languages) {
  return `CAHIER DES CHARGES COMMERCIAL — ${projectName.toUpperCase()}

1. VISION ET OBJECTIF
${idea}

${projectName} est un compagnon touristique intelligent consacré à l’histoire, au patrimoine et à la culture de l’Algérie. L’application accompagne le visiteur selon sa position et lui raconte les lieux qui l’entourent. Elle est construite ville par ville, avec Alger comme ville pilote, puis doit pouvoir être étendue sans reconstruire le système.

Signature : « Chaque lieu a une histoire ».

2. PUBLICS ET RÔLES
- Visiteur sans compte : consultation, carte et recherche.
- Visiteur inscrit : favoris, historique, parcours et réservations.
- Professionnel : hôtel, restaurant, guide, agence, chauffeur, loueur de voitures, artisan, transport ou conciergerie.
- Contributeur culturel : préparation et enrichissement des fiches.
- Modérateur : contrôle des contenus, avis et signalements.
- Administrateur : gestion fonctionnelle et commerciale.
- Super-administrateur : rôles, sécurité et paramètres globaux.

3. LANGUES
${languages}
- Détection de la langue du téléphone.
- Traduction de tous les contenus depuis le back-office.
- Affichage arabe de droite à gauche.
- Textes et contenus audio disponibles par langue.

4. STRUCTURE TERRITORIALE ET CULTURELLE
- Wilayas, villes, communes, quartiers et rues.
- Monuments, musées, bâtiments, places et sites archéologiques.
- Sites naturels, plages, jardins et paysages.
- Personnalités liées aux villes et aux noms des rues.
- Événements historiques et chronologies.
- Architecture, traditions, musique, littérature, gastronomie et artisanat.
- Ancien nom et nom actuel des rues, origine du nom et personnages associés.

5. FICHE D’UN LIEU
- Titre, catégorie et résumé.
- Histoire détaillée et chronologie.
- Architecture, anecdotes et personnalités associées.
- Photographies, vidéos et galerie.
- Lecture audio par langue.
- Coordonnées GPS, adresse et distance.
- Horaires, tarifs, contact et site officiel.
- Accessibilité et conseils de visite.
- Lieux proches et contenus liés.
- Références bibliographiques et sources institutionnelles.
- Statut : brouillon, à vérifier, vérifié, publié ou archivé.

6. CARTE ET GÉOLOCALISATION
- Position réelle du visiteur sur une carte interactive.
- Lieux situés autour de lui avec distance.
- Affichage carte ou liste et regroupement des marqueurs.
- Recherche dans la zone visible et filtres par catégorie.
- Itinéraire à pied ou en voiture.
- Ouverture dans Google Maps ou Apple Plans.
- Suggestions à proximité : « Vous êtes à 150 mètres de ce lieu ».
- Rayon, catégories et fréquence des notifications configurables.
- Mode partiellement hors connexion pour les contenus téléchargés.

7. RECHERCHE ET DÉCOUVERTE
- Recherche par ville, quartier, rue, lieu, personnalité ou thème.
- Filtres : histoire, monuments, musées, architecture, archéologie, nature, culture, gastronomie et artisanat.
- Recommandations selon la position, le temps disponible et les centres d’intérêt.
- Favoris, historique des consultations et partage.
- Signalement d’une information incorrecte.

8. PARCOURS TOURISTIQUES
- Parcours libre ou guidé avec étapes ordonnées.
- Durée, distance, difficulté, accessibilité et transport conseillé.
- Progression enregistrée et reprise d’un parcours interrompu.
- Notification à l’approche d’une étape.
- Téléchargement du parcours hors connexion.
- Exemples : Alger historique, Casbah, patrimoine ottoman, architecture néo-mauresque, artistes, guerre de libération et gastronomie.

9. ESPACE PROFESSIONNEL
- Inscription et vérification administrative.
- Fiche professionnelle avec photos, coordonnées et zone d’activité.
- Services, prix indicatifs et disponibilités.
- Gestion des offres et promotions.
- Réception des demandes et réservations.
- Tableau de bord avec réservations, abonnement et statistiques.
- Réponse aux avis.

10. RÉSERVATIONS ET CONCIERGERIE
- Hôtels et hébergements.
- Restaurants, guides, excursions et activités.
- Location de voitures, chauffeurs et transports.
- Artisanat et services de conciergerie.
- Statuts : nouvelle, en attente, acceptée, refusée, confirmée, réalisée et annulée.
- Confirmation, notification, historique et preuve de réservation.
- Architecture compatible avec un futur paiement en ligne.

11. MODÈLE ÉCONOMIQUE
- Consultation culturelle gratuite pour les visiteurs.
- Abonnements mensuels et annuels des professionnels.
- Fiches gratuite, Standard et Premium.
- Annonces et résultats sponsorisés clairement identifiés.
- Mise en avant sur la carte.
- Commissions sur les réservations.
- Affiliation avec des plateformes partenaires.
- Services de conciergerie.
- Parcours audio et contenus premium.

12. BACK-OFFICE ADMINISTRATEUR
- Tableau de bord : utilisateurs, consultations, parcours, réservations, abonnements, commissions et chiffre d’affaires.
- Gestion sans code des territoires, lieux, rues, personnalités, événements, traditions et parcours.
- Gestion des traductions, médias, contenus audio et sources.
- Workflow de validation et historique des versions.
- Gestion des utilisateurs, rôles, professionnels et vérifications.
- Gestion des réservations, annonces, abonnements et commissions.
- Gestion des avis, signalements, notifications et support.
- L’IA peut aider à rédiger et traduire, mais la publication exige une validation humaine.

13. BASE SUPABASE
- Profils et rôles.
- Villes, quartiers et rues.
- Lieux et traductions.
- Personnalités, événements et sources.
- Médias et contenus audio.
- Parcours et étapes.
- Favoris, historique et avis.
- Professionnels, services et disponibilités.
- Réservations et changements de statut.
- Abonnements, annonces, commissions et notifications.
- Index géographiques pour les recherches de proximité.
- Stockage des images, vidéos, documents et fichiers audio.

14. SÉCURITÉ ET CONFORMITÉ
- Authentification Supabase.
- Règles RLS sur toutes les données privées.
- Un professionnel ne gère que sa fiche et ses réservations.
- Seuls les administrateurs autorisés publient ou modifient les rôles.
- Journal des actions administratives.
- Sauvegarde et restauration.
- Consentement explicite à la géolocalisation.
- RGPD : confidentialité, export, suppression du compte et durée de conservation.
- Conditions générales, politique d’annulation et droits sur les médias.

15. DESIGN ET ACCESSIBILITÉ
- Interface mobile simple, culturelle et premium.
- Vert profond #123C35, doré #D6A84D, ivoire #F7F1E5.
- Responsive téléphone, tablette et ordinateur.
- Accessibilité, lisibilité et compatibilité arabe RTL.
- Compression des médias et fonctionnement sur réseau faible.

16. TECHNOLOGIE ET LIVRAISON
- PWA responsive installable.
- Supabase : PostgreSQL, Auth et Storage.
- GitHub : dépôt, branches et versions.
- GitHub Actions : compilation et tests.
- Cloudflare Pages : Preview et production web.
- Préparation Android et iPhone avec icônes et écrans de démarrage.
- Environnements développement, test et production.
- Variables secrètes non exposées dans le code.

17. TESTS D’ACCEPTATION
- Inscription, connexion et suppression du compte.
- Géolocalisation autorisée ou refusée.
- Recherche, carte, filtres et lieux proches.
- Consultation multilingue et affichage arabe.
- Parcours et progression.
- Favoris et mode hors connexion.
- Inscription professionnelle et vérification.
- Réservation et changement de statut.
- Abonnement et annonce sponsorisée.
- Back-office, permissions et protection des données.
- Compatibilité Android, iPhone et navigateurs principaux.

18. VILLE PILOTE ET DÉPLOIEMENT
Alger est initialisée avec des contenus de démonstration clairement identifiés : Casbah d’Alger, Grande Poste, Jardin d’Essai et premiers parcours. Les contenus commerciaux définitifs doivent être sourcés et validés avant publication.

Villes suivantes prévues : Tizi Ouzou, Oran, Constantine, Béjaïa, Ghardaïa, Tlemcen, Annaba et Djanet.

19. CRITÈRES DES 100 %
- Application réellement fonctionnelle et administrable sans code.
- Géolocalisation, contenus, parcours et réservations opérationnels.
- Monétisation et espace professionnel opérationnels.
- Sécurité, sauvegardes et conformité validées.
- Tests critiques réussis.
- Application installable sur Android et iPhone.
- Prête à être soumise à Google Play et à l’App Store.

Statut : CAHIER DES CHARGES COMPLET — À VALIDER`;
}

function analyzeProject() {
  const projectName = nameInput.value.trim();
  const idea = ideaInput.value.trim();
  const languages = langsInput.value.trim();
  errorBox.textContent = "";
  if (!projectName || !idea) {
    errorBox.textContent = "Renseigne le nom et l’idée du projet avant l’analyse.";
    return;
  }
  analyzeButton.disabled = true;
  analyzeButton.textContent = "Analyse en cours…";
  statusBox.textContent = "Analyse du projet…";
  window.setTimeout(() => {
    const specification = buildSpecification(projectName, idea, languages || "Français");
    specBox.textContent = specification;
    statusBox.textContent = `${projectName} — cahier des charges généré.`;
    copyButton.disabled = false;
    githubButton.disabled = false;
    analyzeButton.disabled = false;
    analyzeButton.textContent = "Analyser automatiquement";
    localStorage.setItem("factory-project", JSON.stringify({ projectName, idea, languages, specification }));
  }, 350);
}

async function copySpecification() {
  try {
    await navigator.clipboard.writeText(specBox.textContent);
    statusBox.textContent = "Cahier des charges copié.";
  } catch (error) {
    statusBox.textContent = "Sélectionne le texte du cahier pour le copier.";
  }
}

function openGitHub() {
  const repository = slugify(nameInput.value) || "nouveau-projet";
  const url = `https://github.com/new?name=${encodeURIComponent(repository)}&description=${encodeURIComponent("Projet généré avec Application Factory")}`;
  window.open(url, "_blank", "noopener,noreferrer");
  statusBox.textContent = "GitHub ouvert : crée le dépôt puis importe le projet généré.";
}

analyzeButton.addEventListener("click", analyzeProject);
copyButton.addEventListener("click", copySpecification);
githubButton.addEventListener("click", openGitHub);

try {
  const saved = JSON.parse(localStorage.getItem("factory-project") || "null");
  if (saved) {
    nameInput.value = saved.projectName || "";
    ideaInput.value = saved.idea || "";
    langsInput.value = saved.languages || "Français, Arabe, Anglais, Kabyle";
    specBox.textContent = saved.specification || "Le cahier des charges apparaîtra ici.";
    if (saved.specification) {
      statusBox.textContent = `${saved.projectName} — projet restauré.`;
      copyButton.disabled = false;
      githubButton.disabled = false;
    }
  }
} catch (error) {
  localStorage.removeItem("factory-project");
}
