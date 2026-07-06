-- ============================================================
-- M.Gallery — Supabase schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- categories ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  display_order integer not null default 0
);

alter table categories enable row level security;

create policy "Public can read categories"
  on categories for select
  using (true);

create policy "Authenticated can manage categories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------- products ----------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null references categories(slug) on update cascade,
  price numeric not null,
  old_price numeric,
  description text,
  image_url text,
  badge text,
  aspect text default 'portrait',
  is_featured boolean default false,
  created_at timestamptz default now()
);

alter table products enable row level security;

create policy "Public can read products"
  on products for select
  using (true);

create policy "Authenticated can manage products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------- storage: product-images bucket ----------
-- Create the bucket itself from the dashboard (Storage → New bucket →
-- "product-images" → Public bucket: ON), then run these policies.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Authenticated can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Authenticated can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- ---------- starter data ----------
insert into categories (slug, name, display_order) values
  ('robes', 'Robes', 0),
  ('manteaux', 'Manteaux', 1),
  ('tailleurs', 'Tailleurs', 2),
  ('accessoires', 'Accessoires', 3),
  ('chaussures', 'Chaussures', 4)
on conflict (slug) do nothing;
