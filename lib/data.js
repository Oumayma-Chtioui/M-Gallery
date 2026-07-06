// In the Horrich Shop pattern this module would call the Supabase
// server client. Here it returns static data so the project runs with
// zero external setup — swap the bodies of these functions for real
// `supabaseServer.from(...)` calls when a project is wired up.

export const categories = [
  { slug: "robes", name: "Robes" },
  { slug: "manteaux", name: "Manteaux" },
  { slug: "tailleurs", name: "Tailleurs" },
  { slug: "accessoires", name: "Accessoires" },
  { slug: "chaussures", name: "Chaussures" },
];

const PRODUCTS = [
  {
    slug: "robe-soie-noire",
    name: "Robe en soie noire",
    category: "robes",
    price: 289,
    oldPrice: null,
    description:
      "Robe longue en soie mélangée, coupe fluide, dos drapé et fermeture invisible. Doublure intérieure en satin.",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80",
    aspect: "portrait",
    isFeatured: true,
    badge: "Nouveauté",
  },
  {
    slug: "manteau-camel",
    name: "Manteau long camel",
    category: "manteaux",
    price: 415,
    oldPrice: 490,
    description:
      "Manteau croisé en laine mélangée, col cranté, ceinture amovible. Une pièce d'archive revisitée pour la saison.",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80",
    aspect: "landscape",
    isFeatured: true,
    badge: "Édition limitée",
  },
  {
    slug: "tailleur-ivoire",
    name: "Tailleur ivoire structuré",
    category: "tailleurs",
    price: 340,
    oldPrice: null,
    description:
      "Veste cintrée et pantalon taille haute assorti, laine légère, doublure en viscose. Fabriqué en atelier.",
    image:
      "https://images.unsplash.com/photo-1548624313-0396c75f8ad2?w=900&q=80",
    aspect: "portrait",
    isFeatured: true,
    badge: null,
  },
  {
    slug: "sac-cuir-bordeaux",
    name: "Sac porté épaule, cuir bordeaux",
    category: "accessoires",
    price: 195,
    oldPrice: null,
    description:
      "Cuir pleine fleur, fermoir laiton brossé, bandoulière ajustable. Fait main en petite série.",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80",
    aspect: "square",
    isFeatured: false,
    badge: null,
  },
  {
    slug: "escarpins-satin",
    name: "Escarpins en satin champagne",
    category: "chaussures",
    price: 165,
    oldPrice: 210,
    description:
      "Talon fin 8cm, bout pointu, semelle intérieure matelassée. Une pièce de soirée intemporelle.",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80",
    aspect: "portrait",
    isFeatured: true,
    badge: "Promo",
  },
  {
    slug: "robe-emeraude",
    name: "Robe drapée émeraude",
    category: "robes",
    price: 265,
    oldPrice: null,
    description:
      "Crêpe fluide, encolure bardot, jupe portefeuille. Se porte du jour au soir sans effort.",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=80",
    aspect: "portrait",
    isFeatured: false,
    badge: null,
  },
  {
    slug: "trench-beige",
    name: "Trench beige double boutonnage",
    category: "manteaux",
    price: 310,
    oldPrice: null,
    description:
      "Coton ciré déperlant, martingale, patte d'épaule. Une signature parisienne pour la mi-saison.",
    image:
      "https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=900&q=80",
    aspect: "landscape",
    isFeatured: false,
    badge: null,
  },
  {
    slug: "foulard-soie-imprime",
    name: "Foulard en soie imprimée",
    category: "accessoires",
    price: 85,
    oldPrice: null,
    description:
      "Twill de soie 100%, bordure roulottée main, imprimé exclusif M.Gallery.",
    image:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=900&q=80",
    aspect: "square",
    isFeatured: false,
    badge: "Nouveauté",
  },
];

export function isOnPromotion(product) {
  return Boolean(product.oldPrice && product.oldPrice > product.price);
}

export async function getProducts() {
  return PRODUCTS;
}

export async function getFeaturedProducts() {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export async function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function getRelatedProducts(product) {
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 3);
}

export async function getCategories() {
  return categories;
}
