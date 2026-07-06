import Link from "next/link";
import { isOnPromotion } from "@/lib/products";

const aspectRatio = {
  portrait: "3 / 4",
  landscape: "4 / 3",
  square: "1 / 1",
};

export default function ProductCard({ product, size = "md" }) {
  const onPromo = isOnPromotion(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ display: "block", position: "relative" }}
      className="product-card"
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: aspectRatio[product.aspect] || "3 / 4",
          background: "var(--ink)",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.7s cubic-bezier(.2,.7,.2,1)",
          }}
          className="product-card-img"
        />

        {product.badge && (
          <span
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ink-on-gold)",
              background: "var(--gold)",
              padding: "5px 10px",
            }}
          >
            {product.badge}
          </span>
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(2,2,3,0.75) 0%, transparent 40%)",
            opacity: 0,
            transition: "opacity 0.35s ease",
          }}
          className="product-card-overlay"
        />

        <span
          style={{
            position: "absolute",
            bottom: 18,
            left: 18,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--gold-soft)",
            opacity: 0,
            transform: "translateY(8px)",
            transition: "all 0.35s ease",
          }}
          className="product-card-cta"
        >
          Voir la pièce →
        </span>
      </div>

      <div style={{ paddingTop: 16, textAlign: size === "sm" ? "left" : "center" }}>
        <h3
          style={{
            fontFamily: "var(--font-accent)",
            fontStyle: "italic",
            fontSize: 19,
            color: "var(--ivory)",
            margin: 0,
          }}
        >
          {product.name}
        </h3>
        <div style={{ marginTop: 8, fontSize: 14, letterSpacing: "0.04em" }}>
          {onPromo && (
            <span
              style={{
                color: "var(--ivory-dim)",
                textDecoration: "line-through",
                marginRight: 10,
              }}
            >
              {product.oldPrice} DT
            </span>
          )}
          <span style={{ color: "var(--gold)" }}>{product.price} DT</span>
        </div>
      </div>
    </Link>
  );
}
