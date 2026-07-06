import Link from "next/link";
import Image from "next/image";
import CartCount from "@/components/CartCount";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/products", label: "Collection" },
  { href: "/products?category=robes", label: "Robes" },
  { href: "/products?category=manteaux", label: "Manteaux" },
  { href: "/products?category=accessoires", label: "Accessoires" },
];

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(8,8,10,0.9)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--line-soft)",
      }}
    >
      <div
        className="wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 84,
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <Image src="/logo.png" alt="M.Gallery" width={44} height={44} />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              letterSpacing: "0.22em",
              color: "var(--gold)",
            }}
          >
            M.GALLERY
          </span>
        </Link>

        <nav style={{ display: "flex", gap: 36 }} className="nav-links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ivory-dim)",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <ThemeToggle />
          <Link href="/cart" className="btn" style={{ padding: "10px 20px" }}>
            Panier
            <CartCount />
          </Link>
        </div>
      </div>
    </header>
  );
}
