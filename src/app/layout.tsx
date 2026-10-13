import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Nuestro pequeño universo",
  description: "Un regalito para vos.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff5f2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body className={`${fraunces.variable} ${dmSans.variable} ${caveat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
