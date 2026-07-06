import Hero from "@/components/Hero";
import CategoryStrip from "@/components/CategoryStrip";
import EditorialGrid from "@/components/EditorialGrid";
import Banner from "@/components/Banner";
import Newsletter from "@/components/Newsletter";
import { getFeaturedProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <main>
      <Hero />
      <CategoryStrip categories={categories} />

      <section className="wrap" style={{ padding: "100px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="eyebrow">La sélection</div>
          <h2 className="section-title" style={{ fontSize: 32, marginTop: 12 }}>
            Pièces du moment
          </h2>
          <div className="hairline" style={{ margin: "18px auto 0" }} />
        </div>
        <EditorialGrid products={featured} />
      </section>

      <Banner
        eyebrow="Édition limitée"
        title="Le manteau camel, revisité"
        subtitle="Une pièce d'archive redessinée en petite série, disponible pour un temps limité."
        cta="Découvrir la pièce"
        href="/product/manteau-camel"
        image="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1600&q=80"
        align="left"
      />

      <Newsletter />
    </main>
  );
}
