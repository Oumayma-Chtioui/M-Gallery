"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { compressImageFile } from "@/lib/imageCompression";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  old_price: "",
  description: "",
  image_url: "",
  badge: "",
  aspect: "portrait",
  is_featured: false,
  stock: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingSlug, setEditingSlug] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    const [{ data: productRows }, { data: categoryRows }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("display_order", { ascending: true }),
    ]);
    setProducts(productRows || []);
    setCategories(categoryRows || []);
    setForm((f) => (f.category ? f : { ...f, category: categoryRows?.[0]?.slug || "" }));
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function slugify(name) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const compressed = await compressImageFile(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1600,
      });

      const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, compressed, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      setForm((f) => ({ ...f, image_url: publicUrlData.publicUrl }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const slug = editingSlug || slugify(form.name);
    const row = {
      slug,
      name: form.name,
      category: form.category,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      description: form.description,
      image_url: form.image_url || null,
      badge: form.badge || null,
      aspect: form.aspect,
      is_featured: form.is_featured,
      stock: form.stock === "" ? 0 : Number(form.stock),
    };

    const { error: upsertError } = await supabase
      .from("products")
      .upsert(row, { onConflict: "slug" });

    setSaving(false);

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    setForm({ ...emptyForm, category: categories[0]?.slug || "" });
    setEditingSlug(null);
    loadAll();
  }

  function handleEdit(product) {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      old_price: product.old_price || "",
      description: product.description || "",
      image_url: product.image_url || "",
      badge: product.badge || "",
      aspect: product.aspect || "portrait",
      is_featured: product.is_featured,
      stock: product.stock ?? 0,
    });
    setEditingSlug(product.slug);
  }

  async function handleDelete(slug) {
    if (!confirm("Supprimer cette pièce définitivement ?")) return;
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("slug", slug);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    if (editingSlug === slug) {
      setForm(emptyForm);
      setEditingSlug(null);
    }
    loadAll();
  }

  if (loading) {
    return <p style={{ color: "var(--ivory-dim)" }}>Chargement…</p>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 40 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid var(--line-soft)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignSelf: "start",
        }}
      >
        <h2 className="section-title" style={{ fontSize: 18 }}>
          {editingSlug ? "Modifier la pièce" : "Ajouter une pièce"}
        </h2>

        {error && <div style={{ color: "#c0645a", fontSize: 13 }}>{error}</div>}

        <input
          placeholder="Nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={inputStyle}
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={inputStyle}
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Prix (DT)"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
          style={inputStyle}
        />

        <input
          placeholder="Ancien prix (optionnel, pour une promo)"
          type="number"
          step="0.01"
          value={form.old_price}
          onChange={(e) => setForm({ ...form, old_price: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Stock (quantité disponible)"
          type="number"
          min="0"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Badge (optionnel — ex. Nouveauté)"
          value={form.badge}
          onChange={(e) => setForm({ ...form, badge: e.target.value })}
          style={inputStyle}
        />

        <select
          value={form.aspect}
          onChange={(e) => setForm({ ...form, aspect: e.target.value })}
          style={inputStyle}
        >
          <option value="portrait">Portrait</option>
          <option value="landscape">Paysage</option>
          <option value="square">Carré</option>
        </select>

        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {uploading && (
            <div style={{ fontSize: 12, color: "var(--gold)", marginTop: 6 }}>
              Compression et envoi de l'image…
            </div>
          )}
          {form.image_url && !uploading && (
            <img
              src={form.image_url}
              alt=""
              style={{ marginTop: 10, height: 100, objectFit: "cover" }}
            />
          )}
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          style={inputStyle}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--ivory-dim)" }}>
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          />
          Mettre en avant sur l'accueil
        </label>

        <button type="submit" className="btn btn-solid" disabled={saving || uploading}>
          {saving ? "Enregistrement…" : editingSlug ? "Enregistrer" : "Ajouter"}
        </button>
        {editingSlug && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              setForm({ ...emptyForm, category: categories[0]?.slug || "" });
              setEditingSlug(null);
            }}
          >
            Annuler
          </button>
        )}
      </form>

      <div>
        <h2 className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>
          Pièces ({products.length})
        </h2>
        {products.length === 0 && (
          <p style={{ color: "var(--ivory-dim)", fontSize: 14 }}>
            Aucune pièce pour l'instant — utilisez le formulaire à gauche.
          </p>
        )}
        {products.map((p) => (
          <div
            key={p.slug}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px solid var(--line-soft)",
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt=""
                  style={{ width: 44, height: 56, objectFit: "cover" }}
                />
              )}
              <div>
                <div style={{ color: "var(--ivory)" }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "var(--ivory-dim)" }}>
                  {p.category} · {p.price} DT · stock: {p.stock ?? 0}
                  {p.is_featured ? " · mis en avant" : ""}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => handleEdit(p)}
                style={{ background: "none", border: "none", color: "var(--gold)", fontSize: 13 }}
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(p.slug)}
                style={{ background: "none", border: "none", color: "#c0645a", fontSize: 13 }}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  background: "var(--ink)",
  border: "1px solid var(--line-soft)",
  color: "var(--ivory)",
  padding: "10px 12px",
  fontFamily: "var(--font-body)",
  fontSize: 14,
};