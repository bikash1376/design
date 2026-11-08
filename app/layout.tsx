import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { IotaPortalProvider } from "@/components/iota/lib/portal";
import { Toaster } from "@/components/iota/ui/toast";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const pixelSquare = localFont({ src: "./fonts/GeistPixel-Square.woff2", variable: "--font-geist-pixel", display: "swap" });
const pixelCircle = localFont({ src: "./fonts/GeistPixel-Circle.woff2", variable: "--font-pixel-circle", display: "swap" });
const pixelGrid = localFont({ src: "./fonts/GeistPixel-Grid.woff2", variable: "--font-pixel-grid", display: "swap" });
const pixelLine = localFont({ src: "./fonts/GeistPixel-Line.woff2", variable: "--font-pixel-line", display: "swap" });
const pixelTriangle = localFont({ src: "./fonts/GeistPixel-Triangle.woff2", variable: "--font-pixel-triangle", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000"),
  title: { default: "iOTA: give your agent taste", template: "%s · iOTA" },
  description: "A design system your coding agent installs and follows: components, tokens and written rules.",
  icons: { icon: "/iota-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pixelSquare.variable} ${pixelCircle.variable} ${pixelGrid.variable} ${pixelLine.variable} ${pixelTriangle.variable} h-full antialiased`}
    >
      <body className="iota h-full">
        <IotaPortalProvider>
          {children}
          <Toaster />
        </IotaPortalProvider>
      </body>
    </html>
  );
}
