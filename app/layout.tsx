import type { Metadata } from "next";
import { Montserrat, Jost } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { site } from "@/lib/site";
import "@/styles/main.scss";

// Free substitutes for the licensed Wix fonts (Avenir → Montserrat, Futura → Jost).
const bodyFont = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const headingFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} | Gundam & Mecha Models, Collectibles & Hobby Supplies`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | Gundam & Mecha Models, Collectibles & Hobby Supplies`,
    description: site.description,
    url: site.domain,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Gundam & Mecha Models, Collectibles & Hobby Supplies`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
