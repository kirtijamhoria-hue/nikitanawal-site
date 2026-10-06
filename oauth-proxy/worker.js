/**
 * GitHub OAuth proxy for Decap CMS — a free-forever replacement for
 * Netlify's deprecated Git Gateway.
 *
 * Deploy this as a Cloudflare Worker (see README section "Future-proof
 * admin login" for exact steps). Requires two secrets set in the Worker's
 * settings: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET, from a GitHub OAuth
 * App you create once.
 *
 * Routes:
 *   GET /auth       -> redirects the admin to GitHub's login/consent screen
 *   GET /callback   -> GitHub redirects back here with a code; this
 *                      exchanges it for an access token and hands it to
 *                      the Decap CMS popup window.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth" || url.pathname === "/") {
      const redirectUri = `${url.origin}/callback`;
      const githubAuthUrl =
        `https://github.com/login/oauth/authorize` +
        `?client_id=${env.GITHUB_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=repo,user`;
      return Response.redirect(githubAuthUrl, 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing code from GitHub.", { status: 400 });
      }

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const tokenData = await tokenRes.json();

      if (tokenData.error || !tokenData.access_token) {
        return new Response(
          `GitHub OAuth error: ${tokenData.error_description || tokenData.error || "unknown error"}`,
          { status: 400 }
        );
      }

      const payload = JSON.stringify({ token: tokenData.access_token, provider: "github" });

      // Decap CMS protocol: the popup waits for a message from its opener,
      // then replies with the token. This small HTML page implements that handshake.
      const html = `<!DOCTYPE html>
<html>
<body>
<script>
  (function() {
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:success:${payload.replace(/'/g, "\\'")}',
        e.origin
      );
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
<p>Signed in — you can close this window if it doesn't close automatically.</p>
</body>
</html>`;

      return new Response(html, { headers: { "Content-Type": "text/html" } });
    }

    return new Response("Not found", { status: 404 });
  },
};
