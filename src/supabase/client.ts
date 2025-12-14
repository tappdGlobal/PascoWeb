import { createClient } from "@jsr/supabase__supabase-js";

// Uses Vite env variables. Ensure these are set in your environment:
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// If environment variables are missing or invalid in the build/deploy environment (e.g. Vercel),
// create a lightweight no-op supabase client to avoid throwing at runtime and
// surface a clear console warning. This prevents a white-screen caused by
// `createClient` throwing when `supabaseUrl` is empty or malformed.
let client: any;
function makeStubClient() {
  console.warn(
    "Supabase environment variables are not set or invalid (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).\n" +
      "Data persistence will be disabled and the app will run in a degraded mode.\n" +
      "Set these env vars in your .env.local (for local dev) or in your Vercel project settings and re-run the dev server / redeploy."
  );

  // Minimal stub implementation covering the used supabase surface in this app.
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: (_: any, callback: any) => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: (_: string) => ({
      select: async () => ({ data: null, error: null }),
      insert: async () => ({ data: null, error: null }),
      upsert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
    }),
    rpc: async () => ({ data: null, error: null }),
  } as any;
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase environment variables are not set (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).\n" +
      "Data persistence will be disabled and the app will run in a degraded mode.\n" +
      "Set these env vars in your Vercel/hosting project settings and re-deploy."
  );
  client = makeStubClient();
} else {
  // Validate the URL looks like a URL — createClient will still throw if malformed,
  // but we try to catch common mistakes early and provide clearer guidance.
  try {
    // This will throw on invalid URL formats
    // eslint-disable-next-line no-new
    new URL(SUPABASE_URL);
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err: any) {
    console.error("Invalid VITE_SUPABASE_URL; falling back to stub client.", err?.message || String(err));
    client = makeStubClient();
  }
}

export default client;
