import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "rv-photos";

// New Supabase API keys are opaque strings, not bearer JWTs — send them as
// `apikey` only, never as `Authorization: Bearer <key>`.
function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = decodeURIComponent((params as { _splat?: string })._splat ?? "");
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });

        // Read-only public client: the bucket stays private, an anon SELECT
        // policy on storage.objects allows downloads. No service-role key
        // needed, so this works in every deployed environment.
        // Prefer runtime server env; fall back to the build-time public
        // values so this also works on self-hosted builds (e.g. Cloudflare)
        // where only the VITE_* variables are configured.
        const url = process.env["SUPABASE_URL"] ?? import.meta.env.VITE_SUPABASE_URL;
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (!url || !key) return new Response("Not found", { status: 404 });

        const supabase = createClient(url, key, {
          global: { fetch: createSupabaseFetch(key) },
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });

        const { data, error } = await supabase.storage.from(BUCKET).download(path);
        if (error || !data) return new Response("Not found", { status: 404 });

        const ext = path.split(".").pop()?.toLowerCase();
        const type =
          ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : "image/jpeg";

        return new Response(await data.arrayBuffer(), {
          headers: {
            "Content-Type": type,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
