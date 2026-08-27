/**
 * MISTERRED360 · Proveedor OAuth para el panel de contenidos (Decap CMS)
 * ────────────────────────────────────────────────────────────────────
 * Este script NO forma parte de la web: es un Cloudflare Worker aparte,
 * gratuito, que solo hace de intermediario en el login con GitHub para
 * que el panel /admin pueda guardar cambios en el repositorio.
 *
 * Qué hace:
 *   GET /auth      → redirige a GitHub para iniciar sesión
 *   GET /callback  → GitHub vuelve aquí con un código; lo cambiamos por
 *                    un token y se lo pasamos de vuelta al panel /admin
 *
 * Necesita dos "secrets" configurados en Cloudflare (nunca en este
 * archivo, nunca en el repositorio): GITHUB_CLIENT_ID y
 * GITHUB_CLIENT_SECRET. Instrucciones completas en GUIA-CMS-SETUP.md.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      return handleAuth(url, env);
    }
    if (url.pathname === "/callback") {
      return handleCallback(url, env, request);
    }
    return new Response("MISTERRED360 CMS OAuth provider", { status: 200 });
  },
};

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}

function handleAuth(url, env) {
  const state = crypto.randomUUID();
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", `${url.origin}/callback`);
  authorizeUrl.searchParams.set("scope", "repo,user");
  authorizeUrl.searchParams.set("state", state);

  const headers = new Headers({ Location: authorizeUrl.toString() });
  // Guardamos el "state" en una cookie de un solo uso para comprobarlo al volver.
  headers.append(
    "Set-Cookie",
    `mr360_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );
  return new Response(null, { status: 302, headers });
}

async function handleCallback(url, env, request) {
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const cookieState = readCookie(request.headers.get("Cookie"), "mr360_oauth_state");

  if (!code) {
    return renderResult(false, "Falta el código de GitHub.");
  }
  if (!returnedState || !cookieState || returnedState !== cookieState) {
    return renderResult(false, "Estado de la sesión no válido. Vuelve a intentarlo.");
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/callback`,
    }),
  });

  const data = await tokenResponse.json();

  if (!tokenResponse.ok || data.error || !data.access_token) {
    return renderResult(false, data.error_description || "No se pudo obtener el token de GitHub.");
  }

  return renderResult(true, null, data.access_token);
}

/**
 * Devuelve la página HTML mínima que Decap CMS espera: envía un
 * postMessage con el resultado a la ventana que abrió el popup de login.
 */
function renderResult(success, errorMessage, token) {
  const payload = success
    ? { token, provider: "github" }
    : { message: errorMessage };
  const status = success ? "success" : "error";
  const body = `<!doctype html>
<html><body>
<script>
  (function () {
    function receiveMessage(message) {
      window.opener.postMessage(
        'authorization:github:${status}:${JSON.stringify(payload).replace(/'/g, "\\'")}',
        message.origin
      );
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
</body></html>`;
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
