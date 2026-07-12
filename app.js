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
