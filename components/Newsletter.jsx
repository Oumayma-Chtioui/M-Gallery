export default function Newsletter() {
  return (
    <section
      className="spotlight"
      style={{
        textAlign: "center",
        padding: "100px 24px",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 16 }}>
        Cercle privé
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 3vw, 34px)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          margin: 0,
        }}
      >
        Recevez les nouvelles pièces en avant-première
      </h2>

      <form
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 0,
          maxWidth: 420,
          margin: "36px auto 0",
          borderBottom: "1px solid var(--gold-dim)",
        }}
      >
        <input
          type="email"
          placeholder="Votre adresse e-mail"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            padding: "12px 8px",
            color: "var(--ivory)",
            fontFamily: "var(--font-body)",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            background: "none",
            border: "none",
            color: "var(--gold)",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "12px 8px",
          }}
        >
          S'inscrire
        </button>
      </form>
    </section>
  );
}
