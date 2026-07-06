# M.Gallery — Fashion Shop

A fully functional boutique e-commerce storefront: Next.js (App Router) +
Supabase (Postgres, Auth, Storage). Elegant black/gold theme built around
the M.Gallery mark, with a real authenticated admin panel behind it —
same pattern as a Supabase-backed storefront + admin split, not a demo.

## Stack

- Next.js 14 (App Router)
- Supabase: Postgres (`products`, `categories`), Storage (`product-images`
  bucket), Auth (email/password gates `/admin`)
- Plain CSS design tokens (`app/globals.css`) — Cinzel / Cormorant
  Garamond / Jost typefaces, no UI kit
- `browser-image-compression` — compresses admin photo uploads client-side
  before they hit Storage

## 1. Create a Supabase project

Go to supabase.com → New project. Once it's up, open **Project Settings →
API** and copy the **Project URL** and **anon public key**.

## 2. Set environment variables

```bash
cp .env.local.example .env.local
```

Fill in the two values from step 1.

## 3. Run the schema

Open **SQL Editor** in your Supabase project, paste the contents of
`schema.sql`, and run it. This creates:

- `categories` and `products` tables with row-level security (public can
  read, only authenticated users can write)
- the `product-images` storage bucket with public read / authenticated
  write policies
- five starter categories (Robes, Manteaux, Tailleurs, Accessoires,
  Chaussures)

## 4. Create an admin login

**Authentication → Users → Add user** in the Supabase dashboard. Create
one with an email/password — that's what you'll use to log into
`/admin`. (Turn off "email confirmations" under Authentication → Settings
if you don't want to click a confirmation link first.)

## 5. Install and run

```bash
npm install
npm run dev
```

- Storefront: `http://localhost:3000`
- Admin: `http://localhost:3000/admin` — log in with the user from step 4

The storefront starts empty (no products yet) until you add some from
`/admin/products`.

## Structure

```
lib/
├── supabaseClient.js   — browser client (admin auth + CRUD)
├── supabaseServer.js   — server client, forces cache: "no-store" so the
│                          storefront reflects admin edits instantly
├── products.js         — getProducts / getProductBySlug / getFeaturedProducts / isOnPromotion
├── categories.js       — getCategories
└── imageCompression.js — compresses images before upload

app/
├── page.js, products/page.js, product/[slug]/page.js, cart/page.js
└── admin/
    ├── layout.js         — wraps every admin route in AdminAuthGate
    ├── products/page.js  — CRUD + image upload, backed by Supabase
    └── categories/page.js — CRUD + reorder

components/AdminAuthGate.jsx — email/password login, gates all of /admin
schema.sql                    — full DB schema, RLS, storage policies, starter data
```

## Design notes

- **Signature motif:** the spotlight cone from the logo is reused as a
  quiet atmospheric background (`.spotlight` in `globals.css`) behind the
  hero and newsletter section.
- **No square product tiles:** portrait-oriented cards with a hover
  reveal; the homepage features an asymmetric editorial grid instead of a
  uniform grid.
- Full-bleed banners for seasonal/promo moments.

## Notes / known limitations

- Cart is a placeholder page — no checkout flow wired up yet.
- Reviews and hero banners (present in the Horrich Shop reference
  project) aren't included here; the schema/pattern for them would follow
  the same shape as `products`/`categories` if you want to add them.
- Deploying to Vercel: add the two env vars in Project Settings →
  Environment Variables before the first deploy.
