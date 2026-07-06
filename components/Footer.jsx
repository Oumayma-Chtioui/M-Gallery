export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line-soft)",
        marginTop: 120,
        padding: "64px 0 40px",
      }}
    >
      <div
        className="wrap"
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gap: 40,
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              letterSpacing: "0.2em",
              color: "var(--gold)",
            }}
          >
            M.GALLERY
          </span>
          <p
            style={{
              fontFamily: "var(--font-accent)",
              fontStyle: "italic",
              color: "var(--ivory-dim)",
              marginTop: 12,
              maxWidth: 280,
              lineHeight: 1.6,
            }}
          >
            Pièces choisies, silhouettes intemporelles.
          </p>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Boutique
          </div>
          {["Robes", "Manteaux", "Tailleurs", "Accessoires"].map((c) => (
            <div
              key={c}
              style={{ color: "var(--ivory-dim)", fontSize: 14, marginBottom: 10 }}
            >
              {c}
            </div>
          ))}
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Maison
          </div>
          {["Notre histoire", "Ateliers", "Presse", "Carrières"].map((c) => (
            <div
              key={c}
              style={{ color: "var(--ivory-dim)", fontSize: 14, marginBottom: 10 }}
            >
              {c}
            </div>
          ))}
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Contact
          </div>
          <div style={{ color: "var(--ivory-dim)", fontSize: 14, marginBottom: 10 }}>
            Monastir, Tunisie
          </div>
          <div style={{ color: "var(--ivory-dim)", fontSize: 14, marginBottom: 10 }}>
            contact@mgallery.tn
          </div>
        </div>
      </div>

      <div
        className="wrap"
        style={{
          marginTop: 56,
          paddingTop: 24,
          borderTop: "1px solid var(--line-soft)",
          fontSize: 11,
          letterSpacing: "0.1em",
          color: "var(--gold-dim)",
          textTransform: "uppercase",
        }}
      >
        © {new Date().getFullYear()} M.Gallery — Fashion Shop
      </div>
    </footer>
  );
}
