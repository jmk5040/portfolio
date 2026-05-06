import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mankeun Jeong — Artist",
  description:
    "Portfolio of Mankeun Jeong, a multidisciplinary artist working across visual, digital, and time-based media.",
  authors: [{ name: "Mankeun Jeong" }],
  openGraph: {
    title: "Mankeun Jeong — Artist",
    description:
      "Portfolio of Mankeun Jeong, a multidisciplinary artist working across visual, digital, and time-based media.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafaf7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&family=Noto+Sans+KR:wght@300;400;500;600&family=Noto+Serif+KR:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <LanguageProvider>
          <Nav />
          <main className="flex-1 bg-paper">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
