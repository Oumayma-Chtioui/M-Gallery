"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = (product.stock ?? 0) <= 0;

  function handleClick() {
    if (outOfStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      className="btn btn-solid"
      style={{ marginTop: 30, opacity: outOfStock ? 0.4 : 1, cursor: outOfStock ? "not-allowed" : "pointer" }}
      onClick={handleClick}
      disabled={outOfStock}
    >
      {outOfStock ? "Rupture de stock" : added ? "Ajouté ✓" : "Ajouter au panier"}
    </button>
  );
}