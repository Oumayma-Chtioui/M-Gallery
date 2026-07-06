import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Server-only, read-only client for Server Components. No session
// persistence. Every fetch is forced to `cache: "no-store"` so Next's
// Data Cache never serves a stale response on a route marked dynamic —
// the admin panel writes directly to Supabase from the browser, so the
// storefront must reflect changes without a rebuild/revalidation window.
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  global: {
    fetch: (url, options = {}) =>
      fetch(url, { ...options, cache: "no-store" }),
  },
});
