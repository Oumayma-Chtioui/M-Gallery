import { getProductBySlug, getRelatedProducts, isOnPromotion } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const onPromo = isOnPromotion(product);

  return (
    <main className="wrap" style={{ padding: "64px 0 120px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 64,
        }}
        className="detail-grid"
      >
        <div style={{ aspectRatio: "3 / 4", overflow: "hidden" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div style={{ paddingTop: 24 }}>
          <div className="eyebrow">{product.category}</div>
          <h1
            style={{
              fontFamily: "var(--font-accent)",
              fontStyle: "italic",
              fontSize: 40,
              margin: "16px 0 0",
              color: "var(--ivory)",
            }}
          >
            {product.name}
          </h1>

          <div style={{ marginTop: 20, fontSize: 20 }}>
            {onPromo && (
              <span
                style={{
                  color: "var(--ivory-dim)",
                  textDecoration: "line-through",
                  marginRight: 14,
                }}
              >
                {product.oldPrice} DT
              </span>
            )}
            <span style={{ color: "var(--gold)" }}>{product.price} DT</span>
          </div>

          <div className="hairline" />

          <p style={{ color: "var(--ivory-dim)", lineHeight: 1.8, fontSize: 15 }}>
            {product.description}
          </p>

          <AddToCartButton product={product} />

          <div
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: "1px solid var(--line-soft)",
              fontSize: 13,
              color: "var(--ivory-dim)",
              lineHeight: 2,
            }}
          >
            Livraison en 3–5 jours ouvrés · Retours acceptés sous 14 jours ·
            Emballage cadeau offert
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section style={{ marginTop: 120 }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="eyebrow">Vous aimerez aussi</div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${related.length}, 1fr)`,
              gap: 36,
            }}
            className="catalog-grid"
          >
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}