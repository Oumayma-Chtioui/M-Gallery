import { supabaseServer } from "./supabaseServer";

export async function getCategories() {
  const { data, error } = await supabaseServer
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data || []).map((row) => ({
    slug: row.slug,
    name: row.name,
    displayOrder: row.display_order,
  }));
}
