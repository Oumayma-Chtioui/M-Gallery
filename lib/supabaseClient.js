"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars are missing. Copy .env.local.example to .env.local " +
      "and fill in your project URL/anon key — see README.md."
  );
}

// Browser client — keeps the auth session in localStorage. Used by the
// admin login form and every admin manager component (products,
// categories). Do not import this into Server Components.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true },
});
