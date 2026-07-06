-- ============================================================
-- M.Gallery — mock product seed data
-- Run in the Supabase SQL editor AFTER schema.sql (needs the
-- `categories` rows to already exist, since `category` references
-- `categories.slug`).
-- Safe to re-run: upserts by slug.
-- ============================================================

insert into products
  (slug, name, category, price, old_price, description, image_url, badge, aspect, is_featured)
values
  (
    'robe-soie-noire',
    'Robe en soie noire',
    'robes',
    289,
    null,
    'Robe longue en soie mélangée, coupe fluide, dos drapé et fermeture invisible. Doublure intérieure en satin.',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80',
    'Nouveauté',
    'portrait',
    true
  ),
  (
    'manteau-camel',
    'Manteau long camel',
    'manteaux',
    415,
    490,
    'Manteau croisé en laine mélangée, col cranté, ceinture amovible. Une pièce d''archive revisitée pour la saison.',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80',
    'Édition limitée',
    'landscape',
    true
  ),
  (
    'tailleur-ivoire',
    'Tailleur ivoire structuré',
    'tailleurs',
    340,
    null,
    'Veste cintrée et pantalon taille haute assorti, laine légère, doublure en viscose. Fabriqué en atelier.',
    'https://images.unsplash.com/photo-1548624313-0396c75f8ad2?w=900&q=80',
    null,
    'portrait',
    true
  ),
  (
    'sac-cuir-bordeaux',
    'Sac porté épaule, cuir bordeaux',
    'accessoires',
    195,
    null,
    'Cuir pleine fleur, fermoir laiton brossé, bandoulière ajustable. Fait main en petite série.',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80',
    null,
    'square',
    false
  ),
  (
    'escarpins-satin',
    'Escarpins en satin champagne',
    'chaussures',
    165,
    210,
    'Talon fin 8cm, bout pointu, semelle intérieure matelassée. Une pièce de soirée intemporelle.',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80',
    'Promo',
    'portrait',
    true
  ),
  (
    'robe-emeraude',
    'Robe drapée émeraude',
    'robes',
    265,
    null,
    'Crêpe fluide, encolure bardot, jupe portefeuille. Se porte du jour au soir sans effort.',
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=80',
    null,
    'portrait',
    false
  ),
  (
    'trench-beige',
    'Trench beige double boutonnage',
    'manteaux',
    310,
    null,
    'Coton ciré déperlant, martingale, patte d''épaule. Une signature parisienne pour la mi-saison.',
    'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=900&q=80',
    null,
    'landscape',
    false
  ),
  (
    'foulard-soie-imprime',
    'Foulard en soie imprimée',
    'accessoires',
    85,
    null,
    'Twill de soie 100%, bordure roulottée main, imprimé exclusif M.Gallery.',
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=900&q=80',
    'Nouveauté',
    'square',
    false
  )
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  old_price = excluded.old_price,
  description = excluded.description,
  image_url = excluded.image_url,
  badge = excluded.badge,
  aspect = excluded.aspect,
  is_featured = excluded.is_featured;
