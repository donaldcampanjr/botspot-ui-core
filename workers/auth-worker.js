export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Helper: parse request body
    async function parseBody(req) {
      try {
        return await req.json();
      } catch {
        return {};
      }
    }

    // Helper: Supabase request
    async function supabaseFetch(endpoint, method, body, key = env.SUPABASE_ANON_KEY) {
      return fetch(`${env.SUPABASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    }

    // Health check
    if (pathname === "/api/auth/hello") {
      return new Response(JSON.stringify({ message: "Worker is live ✅" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // REGISTER
    if (pathname === "/api/auth/register" && request.method === "POST") {
      const { email, password } = await parseBody(request);

      const res = await supabaseFetch("/auth/v1/signup", "POST", {
        email,
        password,
      });

      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: res.status,
      });
    }

    // LOGIN
    if (pathname === "/api/auth/login" && request.method === "POST") {
      const { email, password } = await parseBody(request);

      const res = await supabaseFetch("/auth/v1/token?grant_type=password", "POST", {
        email,
        password,
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        // Set cookie
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `sb:token=${data.access_token}; HttpOnly; Path=/; Secure; SameSite=Lax`,
          },
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: res.status,
      });
    }

    // LOGOUT
    if (pathname === "/api/auth/logout" && request.method === "POST") {
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "sb:token=; HttpOnly; Path=/; Secure; SameSite=Lax; Max-Age=0",
        },
      });
    }

    // VERIFY (check if logged in)
    if (pathname === "/api/auth/verify") {
      const cookie = request.headers.get("Cookie") || "";
      const token = cookie.split("sb:token=")[1]?.split(";")[0];

      if (!token) {
        return new Response(JSON.stringify({ loggedIn: false }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const user = await res.json();
        return new Response(JSON.stringify({ loggedIn: true, user }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ loggedIn: false }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // ME (return logged in user)
    if (pathname === "/api/auth/me") {
      const cookie = request.headers.get("Cookie") || "";
      const token = cookie.split("sb:token=")[1]?.split(";")[0];

      if (!token) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: res.status,
      });
    }

    // Default 404
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
};
