const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return sendJson(
      {
        error: "Méthode HTTP non autorisée.",
      },
      405,
    );
  }

  try {
    const githubToken = Deno.env.get("GITHUB_TOKEN");

    if (!githubToken) {
      throw new Error(
        "Le secret GITHUB_TOKEN est introuvable dans Supabase.",
      );
    }

    const body = await request.json();
    const rawName = String(body?.name ?? "").trim();

    if (!rawName) {
      throw new Error("Le nom du dépôt GitHub est obligatoire.");
    }

    const repositoryName = rawName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!repositoryName) {
      throw new Error("Le nom du dépôt GitHub est invalide.");
    }

    const githubResponse = await fetch(
      "https://api.github.com/user/repos",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: repositoryName,
          private: true,
          auto_init: true,
          description:
            "Projet généré automatiquement par Application Factory",
        }),
      },
    );

    const githubData = await safeJson(githubResponse);

    if (!githubResponse.ok) {
      throw new Error(
        githubData?.message ||
          `GitHub n’a pas pu créer le dépôt (${githubResponse.status}).`,
      );
    }

    return sendJson(
      {
        id: githubData.id,
        name: githubData.name,
        full_name: githubData.full_name,
        html_url: githubData.html_url,
        private: githubData.private,
      },
      201,
    );
  } catch (error) {
    console.error("create-github-repository:", error);

    return sendJson(
      {
        error:
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue.",
      },
      500,
    );
  }
});

async function safeJson(
  response: Response,
): Promise<Record<string, any>> {
  const text = await response.text();

  if (!text.trim()) {
    return {};
  }

  try {
    const parsed = JSON.parse(text);

    return parsed && typeof parsed === "object"
      ? parsed
      : {};
  } catch {
    return {
      raw_response: text,
    };
  }
}

function sendJson(
  data: unknown,
  status: number,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
