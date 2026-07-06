import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      className="spotlight"
      style={{
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <Image src="/logo.png" alt="" width={72} height={72} />
      </div>

      <div className="eyebrow" style={{ marginBottom: 22 }}>
        Collection Printemps — Été
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 7vw, 88px)",
          letterSpacing: "0.06em",
          color: "var(--ivory)",
          margin: 0,
          textTransform: "uppercase",
          lineHeight: 1.05,
        }}
      >
        Le vestiaire
        <br />
        <span style={{ color: "var(--gold)" }}>des silhouettes rares</span>
      </h1>

      <p
        style={{
          fontFamily: "var(--font-accent)",
          fontStyle: "italic",
          fontSize: 20,
          color: "var(--ivory-dim)",
          maxWidth: 480,
          marginTop: 26,
          lineHeight: 1.6,
        }}
      >
        Une sélection de pièces confectionnées avec soin, pensées pour
        traverser les saisons sans jamais se démoder.
      </p>

      <div style={{ display: "flex", gap: 18, marginTop: 44 }}>
        <Link href="/products" className="btn btn-solid">
          Découvrir la collection
        </Link>
        <Link href="/products?category=robes" className="btn">
          Voir les robes
        </Link>
      </div>
    </section>
  );
}
