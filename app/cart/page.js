"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <main
        className="wrap spotlight"
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div className="eyebrow">Panier</div>
        <h1 className="section-title" style={{ fontSize: 30, marginTop: 12 }}>
          Votre panier est vide
        </h1>
        <p style={{ color: "var(--ivory-dim)", marginTop: 12, maxWidth: 360 }}>
          Parcourez la collection pour retrouver ici les pièces que vous avez
          choisies.
        </p>
        <Link href="/products" className="btn btn-solid" style={{ marginTop: 28 }}>
          Voir la collection
        </Link>
      </main>
    );
  }

  return (
    <main className="wrap" style={{ padding: "64px 0 120px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div className="eyebrow">Panier</div>
        <h1 className="section-title" style={{ fontSize: 32, marginTop: 12 }}>
          Votre sélection
        </h1>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {items.map((item) => (
          <div
            key={item.slug}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "20px 0",
              borderBottom: "1px solid var(--line-soft)",
            }}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{ width: 72, height: 90, objectFit: "cover" }}
              />
            )}

            <div style={{ flex: 1 }}>
              <Link
                href={`/product/${item.slug}`}
                style={{
                  fontFamily: "var(--font-accent)",
                  fontStyle: "italic",
                  fontSize: 18,
                  color: "var(--ivory)",
                }}
              >
                {item.name}
              </Link>
              <div style={{ marginTop: 8, color: "var(--gold)", fontSize: 14 }}>
                {item.price} DT
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                style={qtyBtn}
              >
                −
              </button>
              <span style={{ minWidth: 20, textAlign: "center" }}>
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                style={qtyBtn}
              >
                +
              </button>
            </div>

            <div style={{ width: 80, textAlign: "right", color: "var(--ivory)" }}>
              {(item.price * item.quantity).toFixed(2)} DT
            </div>

            <button
              onClick={() => removeItem(item.slug)}
              style={{ background: "none", border: "none", color: "#c0645a", fontSize: 13 }}
            >
              Retirer
            </button>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 32,
            paddingTop: 24,
            borderTop: "1px solid var(--line-soft)",
          }}
        >
          <span
            className="section-title"
            style={{ fontSize: 18, color: "var(--ivory)" }}
          >
            Total
          </span>
          <span style={{ fontSize: 22, color: "var(--gold)" }}>
            {total.toFixed(2)} DT
          </span>
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <button className="btn btn-solid">Passer la commande</button>
        </div>
      </div>
    </main>
  );
}

const qtyBtn = {
  width: 28,
  height: 28,
  border: "1px solid var(--line-soft)",
  background: "var(--ink)",
  color: "var(--ivory)",
};
