import { supabaseServer } from "./supabaseServer";

function mapProduct(row) {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    oldPrice: row.old_price,
    description: row.description,
    image: row.image_url,
    aspect: row.aspect || "portrait",
    isFeatured: row.is_featured,
    badge: row.badge,
  };
}

// A product is "on promo" if old_price is set and higher than price.
export function isOnPromotion(product) {
  return Boolean(product.oldPrice && product.oldPrice > product.price);
}

export async function getProducts() {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function getFeaturedProducts() {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) throw error;
  return (data || []).map(mapProduct);
}

// .maybeSingle() so a missing slug 404s cleanly instead of throwing.
export async function getProductBySlug(slug) {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export async function getRelatedProducts(product) {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("slug", product.slug)
    .limit(3);

  if (error) throw error;
  return (data || []).map(mapProduct);
}
