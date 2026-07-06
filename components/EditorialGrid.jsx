import ProductCard from "./ProductCard";

// Deliberately asymmetric: one tall lead piece, a stacked pair, and a
// wide landscape closer — an editorial "lookbook spread" rather than a
// uniform grid of equal squares.
export default function EditorialGrid({ products }) {
  const [lead, second, third, fourth] = products;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 0.75fr 0.75fr",
        gap: 28,
      }}
      className="editorial-grid"
    >
      {lead && (
        <div style={{ gridRow: "span 2" }}>
          <ProductCard product={lead} />
        </div>
      )}
      {second && <ProductCard product={second} />}
      {third && <ProductCard product={third} />}
      {fourth && (
        <div style={{ gridColumn: "span 2" }}>
          <ProductCard product={fourth} />
        </div>
      )}
    </div>
  );
}
