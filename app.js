const statusElement = document.getElementById("status");
const resultElement = document.getElementById("result");
const projectForm = document.getElementById("projectForm");
const createRepoButton = document.getElementById("generateRepoBtn");

let currentProject = null;

function createSupabaseClient() {
  const config = window.APP_CONFIG;

  if (!config?.SUPABASE_URL || !config?.SUPABASE_ANON_KEY) {
    throw new Error(
      "La connexion Supabase n’est pas correctement configurée dans config.js."
    );
  }

  return window.supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_ANON_KEY
  );
}

function createSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createUniqueSlug(name) {
  return `${createSlug(name)}-${Date.now()}`;
}

function displayResult(data) {
  resultElement.textContent = JSON.stringify(data, null, 2);
}

if (!statusElement || !resultElement || !projectForm || !createRepoButton) {
  throw new Error(
    "Un élément HTML indispensable est absent : status, result, projectForm ou generateRepoBtn."
  );
}

createRepoButton.disabled = true;

projectForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  try {
    statusElement.textContent = "Enregistrement du projet en cours…";
    resultElement.textContent = "";
    createRepoButton.disabled = true;

    const name = document.getElementById("name").value.trim();
    const idea = document.getElementById("idea").value.trim();
    const languages = document
      .getElementById("languages")
      .value.trim();

    if (!name || !idea) {
      throw new Error(
        "Le nom et la description du projet sont obligatoires."
      );
    }

    const supabase = createSupabaseClient();
    const slug = createUniqueSlug(name);

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name,
        slug,
        idea,
        languages: languages || "Français",
        status: "draft"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    currentProject = data;

    statusElement.textContent = "Projet enregistré avec succès.";
    displayResult(currentProject);

    createRepoButton.disabled = false;
  } catch (error) {
    console.error(error);

    currentProject = null;
    createRepoButton.disabled = true;

    statusElement.textContent = "Échec de l’enregistrement.";
    resultElement.textContent =
      error.message || "Une erreur inconnue est survenue.";
  }
});

createRepoButton.addEventListener("click", async function () {
  try {
    if (!currentProject) {
      throw new Error(
        "Enregistre d’abord le projet avant de créer son dépôt GitHub."
      );
    }

    const config = window.APP_CONFIG;

    if (!config?.SUPABASE_ANON_KEY) {
      throw new Error(
        "La clé publique Supabase est introuvable dans config.js."
      );
    }

    createRepoButton.disabled = true;
    statusElement.textContent = "Création du dépôt GitHub en cours…";

    const response = await fetch(
      `${config.SUPABASE_URL}/functions/v1/create-github-repository`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: config.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          name: currentProject.slug
        })
      }
    );

    const repository = await response.json();

    if (!response.ok) {
      throw new Error(
        repository.message ||
          repository.error ||
          "GitHub n’a pas pu créer le dépôt."
      );
    }

    if (!repository.html_url) {
      throw new Error(
        "Le dépôt semble créé, mais GitHub n’a pas retourné son adresse."
      );
    }

    const supabase = createSupabaseClient();

    const { data: updatedProject, error: updateError } = await supabase
      .from("projects")
      .update({
        github_repository_url: repository.html_url,
        status: "repository_created",
        error_message: null
      })
      .eq("id", currentProject.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    currentProject = updatedProject;

    statusElement.textContent = "Dépôt GitHub créé avec succès.";

    displayResult({
      project: currentProject,
      repository: {
        name: repository.name,
        full_name: repository.full_name,
        url: repository.html_url,
        private: repository.private
      }
    });
  } catch (error) {
    console.error(error);

    statusElement.textContent = "Erreur lors de la création GitHub.";
    resultElement.textContent =
      error.message || "Une erreur inconnue est survenue.";

    createRepoButton.disabled = false;
  }
});
