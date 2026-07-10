const statusElement = document.getElementById("status");
const resultElement = document.getElementById("result");
const projectForm = document.getElementById("projectForm");
const createRepoButton = document.getElementById("generateRepoBtn");

let currentProject = null;

function getConfig() {
  const config = window.APP_CONFIG;

  if (!config?.SUPABASE_URL || !config?.SUPABASE_ANON_KEY) {
    throw new Error(
      "La connexion Supabase n’est pas correctement configurée dans config.js."
    );
  }

  return config;
}

function createSupabaseClient() {
  const config = getConfig();

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
    .replace(/^-+|-+$/g, "");
}

function createUniqueSlug(name) {
  return `${createSlug(name)}-${Date.now()}`;
}

function displayResult(data) {
  resultElement.textContent = JSON.stringify(data, null, 2);
}

function displayError(title, error) {
  console.error(error);

  statusElement.textContent = title;
  resultElement.textContent =
    error instanceof Error
      ? error.message
      : "Une erreur inconnue est survenue.";
}

async function callEdgeFunction(functionName, payload) {
  const config = getConfig();

  const response = await fetch(
    `${config.SUPABASE_URL}/functions/v1/${functionName}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: config.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Erreur lors de l’appel de la fonction ${functionName}.`
    );
  }

  return data;
}

if (
  !statusElement ||
  !resultElement ||
  !projectForm ||
  !createRepoButton
) {
  throw new Error(
    "Un élément HTML indispensable est absent : status, result, projectForm ou generateRepoBtn."
  );
}

createRepoButton.disabled = true;

projectForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  try {
    createRepoButton.disabled = true;
    currentProject = null;

    const name = document.getElementById("name").value.trim();
    const idea = document.getElementById("idea").value.trim();
    const languages =
      document.getElementById("languages").value.trim() || "Français";

    if (!name || !idea) {
      throw new Error(
        "Le nom et la description du projet sont obligatoires."
      );
    }

    statusElement.textContent = "Création du projet…";
    resultElement.textContent = "";

    const supabase = createSupabaseClient();
    const slug = createUniqueSlug(name);

    const { data: createdProject, error: insertError } = await supabase
      .from("projects")
      .insert({
        name,
        slug,
        idea,
        languages,
        status: "analyzing",
        specification: null,
        github_repository_url: null,
        deployment_url: null,
        error_message: null
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    currentProject = createdProject;

    statusElement.textContent =
      "Génération du cahier des charges en cours…";

    displayResult({
      project: currentProject,
      message: "Analyse IA en cours"
    });

    const specificationResponse = await callEdgeFunction(
      "generate-specification",
      {
        name,
        idea,
        languages
      }
    );

    if (!specificationResponse?.specification) {
      throw new Error(
        "La fonction IA n’a retourné aucun cahier des charges."
      );
    }

    const { data: analyzedProject, error: updateError } = await supabase
      .from("projects")
      .update({
        specification: specificationResponse.specification,
        status: "analyzed",
        error_message: null
      })
      .eq("id", currentProject.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    currentProject = analyzedProject;

    statusElement.textContent =
      "Projet analysé et cahier des charges généré.";

    displayResult({
      project: currentProject,
      ai: {
        model: specificationResponse.model || null,
        attempt: specificationResponse.attempt || null
      },
      specification: currentProject.specification
    });

    createRepoButton.disabled = false;
  } catch (error) {
    createRepoButton.disabled = true;

    if (currentProject?.id) {
      try {
        const supabase = createSupabaseClient();

        await supabase
          .from("projects")
          .update({
            status: "failed",
            error_message:
              error instanceof Error
                ? error.message
                : "Une erreur inconnue est survenue."
          })
          .eq("id", currentProject.id);
      } catch (updateError) {
        console.error(
          "Impossible d’enregistrer l’erreur dans Supabase :",
          updateError
        );
      }
    }

    displayError("Échec de l’analyse du projet.", error);
  }
});

createRepoButton.addEventListener("click", async function () {
  try {
    if (!currentProject) {
      throw new Error(
        "Analyse d’abord le projet avant de créer son dépôt GitHub."
      );
    }

    createRepoButton.disabled = true;
    statusElement.textContent =
      "Création du dépôt GitHub en cours…";

    const repository = await callEdgeFunction(
      "create-github-repository",
      {
        name: currentProject.slug
      }
    );

    if (!repository?.html_url) {
      throw new Error(
        "GitHub n’a pas retourné l’adresse du dépôt."
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

    statusElement.textContent =
      "Projet prêt : cahier des charges et dépôt GitHub créés.";

    displayResult({
      project: currentProject,
      specification: currentProject.specification,
      repository: {
        name: repository.name,
        full_name: repository.full_name,
        url: repository.html_url,
        private: repository.private
      }
    });
  } catch (error) {
    createRepoButton.disabled = false;

    if (currentProject?.id) {
      try {
        const supabase = createSupabaseClient();

        await supabase
          .from("projects")
          .update({
            error_message:
              error instanceof Error
                ? error.message
                : "Une erreur inconnue est survenue."
          })
          .eq("id", currentProject.id);
      } catch (updateError) {
        console.error(
          "Impossible d’enregistrer l’erreur GitHub :",
          updateError
        );
      }
    }

    displayError(
      "Erreur lors de la création du dépôt GitHub.",
      error
    );
  }
});
