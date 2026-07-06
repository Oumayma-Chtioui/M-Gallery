"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) setError(error.message);
    setCategories(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function slugify(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const slug = slugify(name);
    const displayOrder = categories.length
      ? Math.max(...categories.map((c) => c.display_order || 0)) + 1
      : 0;

    const { error } = await supabase
      .from("categories")
      .insert({ slug, name, display_order: displayOrder });

    if (error) {
      setError(error.message);
      return;
    }
    setName("");
    load();
  }

  async function handleDelete(slug) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const { error } = await supabase.from("categories").delete().eq("slug", slug);
    if (error) setError(error.message);
    load();
  }

  async function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;

    const a = categories[index];
    const b = categories[target];

    await Promise.all([
      supabase.from("categories").update({ display_order: b.display_order }).eq("slug", a.slug),
      supabase.from("categories").update({ display_order: a.display_order }).eq("slug", b.slug),
    ]);
    load();
  }

  if (loading) return <p style={{ color: "var(--ivory-dim)" }}>Chargement…</p>;

  return (
    <div style={{ maxWidth: 520 }}>
      <h2 className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>
        Catégories
      </h2>

      {error && <div style={{ color: "#c0645a", fontSize: 13, marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <input
          placeholder="Nouvelle catégorie"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            flex: 1,
            background: "var(--ink)",
            border: "1px solid var(--line-soft)",
            color: "var(--ivory)",
            padding: "10px 12px",
            fontFamily: "var(--font-body)",
            fontSize: 14,
          }}
        />
        <button type="submit" className="btn btn-solid">
          Ajouter
        </button>
      </form>

      {categories.map((c, i) => (
        <div
          key={c.slug}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid var(--line-soft)",
          }}
        >
          <span style={{ color: "var(--ivory)" }}>{c.name}</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => move(i, -1)} style={iconBtn}>
              ↑
            </button>
            <button onClick={() => move(i, 1)} style={iconBtn}>
              ↓
            </button>
            <button onClick={() => handleDelete(c.slug)} style={{ ...iconBtn, color: "#c0645a" }}>
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const iconBtn = {
  background: "none",
  border: "none",
  color: "var(--gold)",
  fontSize: 13,
};
