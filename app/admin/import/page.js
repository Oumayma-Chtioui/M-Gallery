"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabaseClient";

const EXPECTED_COLUMNS = [
  "id (optionnel)",
  "name",
  "category",
  "price",
  "old_price",
  "stock",
  "description",
  "image_url",
  "badge",
  "aspect",
  "is_featured",
];

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function truthy(value) {
  if (typeof value === "boolean") return value;
  return ["true", "1", "yes", "oui", "vrai"].includes(
    String(value || "").trim().toLowerCase()
  );
}

export default function AdminImportPage() {
  const [categories, setCategories] = useState([]);
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [parseError, setParseError] = useState("");

  async function ensureCategoriesLoaded() {
    if (categories.length) return categories;
    const { data } = await supabase.from("categories").select("slug, name");
    setCategories(data || []);
    return data || [];
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    setParseError("");
    setFileName(file.name);

    const categoryList = await ensureCategoriesLoaded();
    const validSlugs = new Set(categoryList.map((c) => c.slug));

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (raw.length === 0) {
        setParseError("Le fichier ne contient aucune ligne.");
        return;
      }

      const parsed = raw.map((r, i) => {
        const name = String(r.name || r.Name || r.nom || "").trim();
        const explicitId = String(r.id || r.sku || r.ID || r.SKU || "").trim();
        const category = slugify(r.category || r.Category || r.categorie || "");
        const price = Number(r.price ?? r.Price ?? r.prix ?? "");
        const oldPriceRaw = r.old_price ?? r.oldPrice ?? r.ancien_prix ?? "";
        const oldPrice = oldPriceRaw === "" ? null : Number(oldPriceRaw);
        const stockRaw = r.stock ?? r.Stock ?? "";
        const stock = stockRaw === "" ? 0 : Number(stockRaw);

        const errors = [];
        if (!name) errors.push("nom manquant");
        if (!category) errors.push("catégorie manquante");
        else if (!validSlugs.has(category))
          errors.push(`catégorie inconnue: "${category}"`);
        if (!price || Number.isNaN(price)) errors.push("prix invalide");
        if (oldPriceRaw !== "" && Number.isNaN(oldPrice))
          errors.push("ancien prix invalide");
        if (stockRaw !== "" && Number.isNaN(stock))
          errors.push("stock invalide");

        return {
          rowNumber: i + 2, // +2: header row + 1-indexing, matches spreadsheet line
          // An explicit id/sku column, if present, is used as the slug —
          // that's what lets a re-import of "the same product" be
          // recognized as the same row instead of slugify(name) drifting
          // on a small wording change and creating a duplicate.
          slug: slugify(explicitId || name),
          name,
          category,
          price,
          old_price: oldPrice,
          stock,
          description: String(r.description || "").trim() || null,
          image_url: String(r.image_url || r.imageUrl || "").trim() || null,
          badge: String(r.badge || "").trim() || null,
          aspect: ["portrait", "landscape", "square"].includes(r.aspect)
            ? r.aspect
            : "portrait",
          is_featured: truthy(r.is_featured ?? r.isFeatured),
          errors,
        };
      });

      setRows(parsed);
    } catch (err) {
      setParseError(
        "Impossible de lire ce fichier. Vérifiez qu'il s'agit bien d'un .xlsx, .xls ou .csv valide."
      );
    }
  }

  const validRows = rows.filter((r) => r.errors.length === 0);
  const invalidRows = rows.filter((r) => r.errors.length > 0);

  async function handleImport() {
    if (validRows.length === 0) return;
    setImporting(true);
    setResult(null);

    // Look up current stock for any row that already exists (matched by
    // slug/id), so re-importing the same product adds to stock instead
    // of clobbering it — everything else still gets overwritten with the
    // sheet's values.
    const slugs = validRows.map((r) => r.slug);
    const { data: existingRows, error: fetchError } = await supabase
      .from("products")
      .select("slug, stock")
      .in("slug", slugs);

    if (fetchError) {
      setImporting(false);
      setResult({ ok: false, message: fetchError.message });
      return;
    }

    const existingStock = new Map(
      (existingRows || []).map((r) => [r.slug, r.stock ?? 0])
    );

    const payload = validRows.map(({ rowNumber, errors, ...row }) => ({
      ...row,
      stock: (existingStock.get(row.slug) || 0) + row.stock,
    }));

    const { error } = await supabase
      .from("products")
      .upsert(payload, { onConflict: "slug" });

    setImporting(false);

    if (error) {
      setResult({ ok: false, message: error.message });
    } else {
      setResult({
        ok: true,
        message: `${validRows.length} pièce(s) importée(s) avec succès. Le stock des pièces déjà existantes a été additionné.`,
      });
      setRows([]);
      setFileName("");
    }
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 className="section-title" style={{ fontSize: 18, marginBottom: 8 }}>
        Import en masse
      </h2>
      <p style={{ color: "var(--ivory-dim)", fontSize: 14, marginBottom: 20 }}>
        Importez un fichier Excel (.xlsx) ou CSV avec les colonnes :{" "}
        <code style={{ color: "var(--gold)" }}>
          {EXPECTED_COLUMNS.join(", ")}
        </code>
        . Une ligne = une pièce. Donnez un{" "}
        <strong style={{ color: "var(--ivory)" }}>id</strong> stable à chaque
        pièce (ex. une référence produit) — c'est ce qui permet de
        reconnaître "la même pièce" d'un import à l'autre. Sans id, le nom
        sert d'identifiant. Si une pièce existe déjà, ses infos sont mises à
        jour et son <strong style={{ color: "var(--ivory)" }}>stock est
        additionné</strong> (pas remplacé) avec la valeur importée.
      </p>

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFile}
        style={{ marginBottom: 20 }}
      />

      {parseError && (
        <div style={{ color: "#c0645a", fontSize: 13, marginBottom: 16 }}>
          {parseError}
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              gap: 24,
              fontSize: 13,
              color: "var(--ivory-dim)",
              marginBottom: 16,
            }}
          >
            <span>
              Fichier : <strong style={{ color: "var(--ivory)" }}>{fileName}</strong>
            </span>
            <span style={{ color: "var(--gold)" }}>{validRows.length} valide(s)</span>
            {invalidRows.length > 0 && (
              <span style={{ color: "#c0645a" }}>
                {invalidRows.length} en erreur (ignorée(s))
              </span>
            )}
          </div>

          <div
            style={{
              maxHeight: 380,
              overflowY: "auto",
              border: "1px solid var(--line-soft)",
              marginBottom: 20,
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line-soft)" }}>
                  {["Ligne", "Nom", "Catégorie", "Prix", "Ancien prix", "Statut"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "10px 12px",
                          color: "var(--gold)",
                          fontWeight: 400,
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.rowNumber}
                    style={{ borderBottom: "1px solid var(--line-soft)" }}
                  >
                    <td style={{ padding: "8px 12px", color: "var(--ivory-dim)" }}>
                      {r.rowNumber}
                    </td>
                    <td style={{ padding: "8px 12px", color: "var(--ivory)" }}>
                      {r.name || "—"}
                    </td>
                    <td style={{ padding: "8px 12px", color: "var(--ivory-dim)" }}>
                      {r.category || "—"}
                    </td>
                    <td style={{ padding: "8px 12px", color: "var(--ivory-dim)" }}>
                      {r.price || "—"}
                    </td>
                    <td style={{ padding: "8px 12px", color: "var(--ivory-dim)" }}>
                      {r.old_price ?? "—"}
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      {r.errors.length === 0 ? (
                        <span style={{ color: "var(--gold)" }}>OK</span>
                      ) : (
                        <span style={{ color: "#c0645a" }}>{r.errors.join(", ")}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="btn btn-solid"
            disabled={validRows.length === 0 || importing}
            onClick={handleImport}
          >
            {importing
              ? "Import en cours…"
              : `Importer ${validRows.length} pièce(s)`}
          </button>
        </>
      )}

      {result && (
        <div
          style={{
            marginTop: 20,
            color: result.ok ? "var(--gold)" : "#c0645a",
            fontSize: 14,
          }}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}