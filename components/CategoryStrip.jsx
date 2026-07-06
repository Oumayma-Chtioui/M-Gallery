import Link from "next/link";

export default function CategoryStrip({ categories }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 48,
        flexWrap: "wrap",
        padding: "56px 0",
        borderTop: "1px solid var(--line-soft)",
        borderBottom: "1px solid var(--line-soft)",
      }}
    >
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/products?category=${c.slug}`}
          className="category-link"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ivory-dim)",
            paddingBottom: 6,
            borderBottom: "1px solid transparent",
          }}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
