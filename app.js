const statusElement = document.getElementById("status");
const resultElement = document.getElementById("result");
const projectForm = document.getElementById("projectForm");

function createSupabaseClient() {
  const config = window.APP_CONFIG;

  if (!config?.SUPABASE_URL || !config?.SUPABASE_ANON_KEY) {
    throw new Error(
      "La connexion Supabase n’est pas configurée dans config.js."
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

projectForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  try {
    statusElement.textContent = "Enregistrement du projet en cours…";
    resultElement.textContent = "";

    const name = document.getElementById("name").value.trim();
    const idea = document.getElementById("idea").value.trim();
    const languages = document.getElementById("languages").value.trim();

    if (!name || !idea) {
      throw new Error("Le nom et la description du projet sont obligatoires.");
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name,
        slug: createSlug(name),
        idea,
        languages: languages || "Français",
        status: "draft"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    statusElement.textContent = "Projet enregistré avec succès.";
    resultElement.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error(error);

    statusElement.textContent = "Échec de l’enregistrement.";
    resultElement.textContent =
      error.message || "Une erreur inconnue est survenue.";
  }
});
