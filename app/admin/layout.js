import AdminAuthGate from "@/components/AdminAuthGate";

export const metadata = { title: "M.Gallery — Admin" };

export default function AdminLayout({ children }) {
  return (
    <AdminAuthGate>
      <div style={{ minHeight: "100vh", background: "var(--black)" }}>
        <div
          style={{
            borderBottom: "1px solid var(--line-soft)",
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "0.2em",
              color: "var(--gold)",
            }}
          >
            M.GALLERY — ADMIN
          </span>
          <nav style={{ display: "flex", gap: 24, fontSize: 13, color: "var(--ivory-dim)" }}>
            <a href="/admin/products">Produits</a>
            <a href="/admin/categories">Catégories</a>
            <a href="/admin/import">Import</a>
            <a href="/">Retour à la boutique</a>
          </nav>
        </div>
        <div style={{ padding: 32 }}>{children}</div>
      </div>
    </AdminAuthGate>
  );
}