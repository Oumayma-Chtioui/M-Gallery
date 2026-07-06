import Link from "next/link";

export default function Banner({
  eyebrow,
  title,
  subtitle,
  cta,
  href,
  image,
  align = "left",
}) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: 480,
        display: "flex",
        alignItems: "center",
        justifyContent: align === "left" ? "flex-start" : "flex-end",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <img
        src={image}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            align === "left"
              ? "linear-gradient(90deg, rgba(2,2,3,0.88) 0%, rgba(2,2,3,0.35) 55%, transparent 100%)"
              : "linear-gradient(270deg, rgba(2,2,3,0.88) 0%, rgba(2,2,3,0.35) 55%, transparent 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          padding: "0 64px",
          maxWidth: 420,
          textAlign: "left",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 14 }}>
          {eyebrow}
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 44px)",
            color: "var(--ivory)",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-accent)",
            fontStyle: "italic",
            color: "var(--ivory-dim)",
            fontSize: 18,
            marginTop: 16,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
        <Link href={href} className="btn btn-solid" style={{ marginTop: 30 }}>
          {cta}
        </Link>
      </div>
    </section>
  );
}
