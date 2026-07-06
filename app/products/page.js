import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const activeCategory = searchParams?.category;
  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <main className="wrap" style={{ padding: "72px 0 120px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div className="eyebrow">Boutique</div>
        <h1 className="section-title" style={{ fontSize: 36, marginTop: 12 }}>
          La collection
        </h1>
        <div className="hairline" style={{ margin: "18px auto 0" }} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 28,
          flexWrap: "wrap",
          marginBottom: 56,
        }}
      >
        <Link
          href="/products"
          style={{
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: !activeCategory ? "var(--gold)" : "var(--ivory-dim)",
          }}
        >
          Tout voir
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            style={{
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: activeCategory === c.slug ? "var(--gold)" : "var(--ivory-dim)",
            }}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 40,
        }}
        className="catalog-grid"
      >
        {filtered.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--ivory-dim)" }}>
          Aucune pièce dans cette catégorie pour le moment.
        </p>
      )}
    </main>
  );
}
