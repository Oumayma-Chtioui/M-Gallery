"use client";

import { useCart } from "@/components/CartContext";

export default function CartCount() {
  const { count } = useCart();
  if (!count) return null;
  return (
    <span
      style={{
        marginLeft: 8,
        fontSize: 11,
        color: "var(--ink-on-gold)",
        background: "var(--gold)",
        borderRadius: "50%",
        width: 18,
        height: 18,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {count}
    </span>
  );
}
