var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// workers/auth-worker.js
var auth_worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const corsHeaders = {
      "Access-Control-Allow-Origin": env.APP_BASE_URL,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
      "Access-Control-Allow-Credentials": "true"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    const RATE = { windowMs: 5 * 60 * 1e3, max: 10 };
    const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "anon";
    self.__ipHits = self.__ipHits || /* @__PURE__ */ new Map();
    function isRateLimited(bucket) {
      const key = `${ip}:${bucket}`;
      const now = Date.now();
      const arr = self.__ipHits.get(key) || [];
      const fresh = arr.filter((t) => now - t < RATE.windowMs);
      if (fresh.length >= RATE.max) return true;
      fresh.push(now);
      self.__ipHits.set(key, fresh);
      return false;
    }
    __name(isRateLimited, "isRateLimited");
    async function parseBody(req) {
      try {
        return await req.json();
      } catch {
        return {};
      }
    }
    __name(parseBody, "parseBody");
    function withHeaders(extra = {}) {
      return { ...corsHeaders, ...extra };
    }
    __name(withHeaders, "withHeaders");
    async function supabaseFetch(endpoint, method, body, key = env.SUPABASE_ANON_KEY) {
      return fetch(`${env.SUPABASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Authorization: `Bearer ${key}`
        },
        body: body ? JSON.stringify(body) : void 0
      });
    }
    __name(supabaseFetch, "supabaseFetch");
    async function sendWelcomeEmail(email) {
      if (!env.RESEND_API_KEY || !env.RESEND_FROM) return;
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: env.RESEND_FROM,
            to: email,
            subject: "Welcome to BotSpot \u{1F389}",
            html: `<p>Hi ${email}, welcome to BotSpot! Your account is ready.</p>`
          })
        });
      } catch {
      }
    }
    __name(sendWelcomeEmail, "sendWelcomeEmail");
    if (pathname === "/api/auth/hello") {
      return new Response(JSON.stringify({ message: "Worker is live \u2705" }), {
        headers: withHeaders({ "Content-Type": "application/json" })
      });
    }
    if (pathname === "/api/auth/register" && request.method === "POST") {
      if (isRateLimited("register")) {
        return new Response(JSON.stringify({ error: "Too many requests" }), {
          status: 429,
          headers: withHeaders({ "Content-Type": "application/json" })
        });
      }
      const { email, password } = await parseBody(request);
      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password required" }), {
          status: 400,
          headers: withHeaders({ "Content-Type": "application/json" })
        });
      }
      const res = await supabaseFetch("/auth/v1/signup", "POST", {
        email,
        password,
        email_confirm: !env.RESEND_API_KEY
        // Auto-confirm email if no email service configured
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMsg = data?.msg || data?.error_description || "Registration failed";
        return new Response(JSON.stringify({
          error: errorMsg,
          debug: {
            status: res.status,
            response: data,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }
        }), {
          status: res.status,
          headers: withHeaders({ "Content-Type": "application/json" })
        });
      }
      let user = data?.user || null;
      const debugInfo = {
        roleEnrichmentAttempts: [],
        emailSent: false,
        autoLogin: false
      };
      if (env.SUPABASE_SERVICE_ROLE_KEY && user?.id) {
        try {
          const roleRes = await fetch(`${env.SUPABASE_URL}/rest/v1/user_roles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
              Prefer: "return=minimal"
            },
            body: JSON.stringify({ user_id: user.id, role: "Daily User" })
          });
          debugInfo.roleEnrichmentAttempts.push({
            type: "role_table_insert",
            success: roleRes.ok,
            status: roleRes.status
          });
        } catch (error) {
          debugInfo.roleEnrichmentAttempts.push({
            type: "role_table_insert",
            success: false,
            error: error.message || "Unknown error"
          });
        }
        try {
          const metadataRes = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              apikey: env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({ user_metadata: { ...user.user_metadata || {}, role: "Daily User" } })
          });
          debugInfo.roleEnrichmentAttempts.push({
            type: "user_metadata_update",
            success: metadataRes.ok,
            status: metadataRes.status
          });
          if (metadataRes.ok) {
            user.user_metadata = { ...user.user_metadata || {}, role: "Daily User" };
            user.role = "Daily User";
          }
        } catch (error) {
          debugInfo.roleEnrichmentAttempts.push({
            type: "user_metadata_update",
            success: false,
            error: error.message || "Unknown error"
          });
        }
      } else {
        debugInfo.roleEnrichmentAttempts.push({
          type: "skipped",
          reason: !env.SUPABASE_SERVICE_ROLE_KEY ? "No service role key" : "No user ID"
        });
      }
      const loginRes = await supabaseFetch("/auth/v1/token?grant_type=password", "POST", { email, password });
      const loginData = await loginRes.json().catch(() => ({}));
      try {
        await sendWelcomeEmail(email);
        debugInfo.emailSent = !!env.RESEND_API_KEY;
      } catch (error) {
        debugInfo.emailSent = false;
      }
      if (loginRes.ok && loginData?.access_token) {
        debugInfo.autoLogin = true;
        return new Response(JSON.stringify({
          success: true,
          user,
          debug: debugInfo
        }), {
          headers: withHeaders({
            "Content-Type": "application/json",
            "Set-Cookie": `sb:token=${loginData.access_token}; HttpOnly; Path=/; SameSite=Lax${env.APP_BASE_URL && env.APP_BASE_URL.startsWith("https") ? "; Secure" : ""}`
          })
        });
      }
      debugInfo.autoLogin = false;
      return new Response(JSON.stringify({
        success: true,
        user,
        debug: debugInfo
      }), {
        headers: withHeaders({ "Content-Type": "application/json" })
      });
    }
    if (pathname === "/api/auth/login" && request.method === "POST") {
      if (isRateLimited("login")) {
        return new Response(JSON.stringify({ error: "Too many requests" }), {
          status: 429,
          headers: withHeaders({ "Content-Type": "application/json" })
        });
      }
      const { email, password } = await parseBody(request);
      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password required" }), {
          status: 400,
          headers: withHeaders({ "Content-Type": "application/json" })
        });
      }
      const res = await supabaseFetch("/auth/v1/token?grant_type=password", "POST", { email, password });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.access_token) {
        return new Response(JSON.stringify({ success: true, user: data.user }), {
          headers: withHeaders({
            "Content-Type": "application/json",
            "Set-Cookie": `sb:token=${data.access_token}; HttpOnly; Path=/; SameSite=Lax${env.APP_BASE_URL && env.APP_BASE_URL.startsWith("https") ? "; Secure" : ""}`
          })
        });
      }
      return new Response(JSON.stringify({ error: data?.error_description || "Invalid credentials" }), {
        status: res.status,
        headers: withHeaders({ "Content-Type": "application/json" })
      });
    }
    if (pathname === "/api/auth/logout" && request.method === "POST") {
      return new Response(JSON.stringify({ success: true }), {
        headers: withHeaders({
          "Content-Type": "application/json",
          "Set-Cookie": `sb:token=; HttpOnly; Path=/; SameSite=Lax${env.APP_BASE_URL && env.APP_BASE_URL.startsWith("https") ? "; Secure" : ""}; Max-Age=0`
        })
      });
    }
    if (pathname === "/api/auth/verify") {
      const cookie = request.headers.get("Cookie") || "";
      const token = cookie.split("sb:token=")[1]?.split(";")[0];
      if (!token) {
        return new Response(JSON.stringify({ loggedIn: false }), {
          headers: withHeaders({ "Content-Type": "application/json" })
        });
      }
      const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const user = await res.json();
        try {
          if (env.SUPABASE_SERVICE_ROLE_KEY && user?.id) {
            const r = await fetch(`${env.SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${user.id}&select=role`, {
              headers: {
                apikey: env.SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
              }
            });
            const roles = await r.json().catch(() => []);
            const role = roles?.[0]?.role || "Daily User";
            user.user_metadata = { ...user.user_metadata || {}, role };
            user.role = role;
          }
        } catch {
        }
        return new Response(JSON.stringify({ loggedIn: true, user }), {
          headers: withHeaders({ "Content-Type": "application/json" })
        });
      }
      return new Response(JSON.stringify({ loggedIn: false }), {
        headers: withHeaders({ "Content-Type": "application/json" })
      });
    }
    if (pathname === "/api/auth/resend-verification" && request.method === "POST") {
      if (isRateLimited("resend")) {
        return new Response(JSON.stringify({ error: "Too many requests" }), {
          status: 429,
          headers: withHeaders({ "Content-Type": "application/json" })
        });
      }
      const { email } = await parseBody(request);
      if (!email) {
        return new Response(JSON.stringify({ error: "Email required" }), {
          status: 400,
          headers: withHeaders({ "Content-Type": "application/json" })
        });
      }
      try {
        if (env.RESEND_API_KEY && env.RESEND_FROM) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
              from: env.RESEND_FROM,
              to: email,
              subject: "Verify your BotSpot email",
              html: `<p>Hi ${email}, if your account requires verification, please check your inbox for the confirmation link. If you didn't request this, ignore this email.</p>`
            })
          });
        }
      } catch {
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: withHeaders({ "Content-Type": "application/json" })
      });
    }
    if (pathname.startsWith("/api/auth/verify-email")) {
      const params = new URL(request.url).searchParams;
      const token = params.get("token") || params.get("token_hash");
      if (!token) {
        return new Response(JSON.stringify({ error: "Missing token" }), {
          status: 400,
          headers: withHeaders({ "Content-Type": "application/json" })
        });
      }
      let ok = false;
      try {
        const r1 = await fetch(`${env.SUPABASE_URL}/auth/v1/verify?type=signup&token_hash=${encodeURIComponent(token)}`, {
          headers: { apikey: env.SUPABASE_ANON_KEY }
        });
        ok = r1.ok;
      } catch {
      }
      if (!ok) {
        try {
          const r2 = await fetch(`${env.SUPABASE_URL}/auth/v1/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey: env.SUPABASE_ANON_KEY },
            body: JSON.stringify({ type: "signup", token })
          });
          ok = r2.ok;
        } catch {
        }
      }
      return new Response(JSON.stringify({ success: ok }), {
        status: ok ? 200 : 400,
        headers: withHeaders({ "Content-Type": "application/json" })
      });
    }
    if (pathname === "/api/auth/me") {
      const cookie = request.headers.get("Cookie") || "";
      const token = cookie.split("sb:token=")[1]?.split(";")[0];
      if (!token) {
        return new Response(JSON.stringify({ loggedIn: false }), {
          status: 401,
          headers: withHeaders({ "Content-Type": "application/json" })
        });
      }
      const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json().catch(() => ({}));
      try {
        if (env.SUPABASE_SERVICE_ROLE_KEY && data?.id) {
          const r = await fetch(`${env.SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${data.id}&select=role`, {
            headers: {
              apikey: env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
            }
          });
          const roles = await r.json().catch(() => []);
          const role = roles?.[0]?.role || "Daily User";
          data.user_metadata = { ...data.user_metadata || {}, role };
          data.role = role;
        }
      } catch {
      }
      return new Response(JSON.stringify({ loggedIn: res.ok, user: data }), {
        status: res.status,
        headers: withHeaders({ "Content-Type": "application/json" })
      });
    }
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: withHeaders({ "Content-Type": "application/json" })
    });
  }
};

// ../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-MPN6ba/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = auth_worker_default;

// ../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-MPN6ba/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=auth-worker.js.map
