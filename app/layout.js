import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { ThemeProvider } from "@/components/ThemeContext";

export const metadata = {
  title: "M.Gallery — Fashion Shop",
  description:
    "M.Gallery, pièces choisies et silhouettes intemporelles pour un vestiaire rare.",
};

const themeInitScript = `
  try {
    var theme = localStorage.getItem('mgallery_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <ThemeProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
