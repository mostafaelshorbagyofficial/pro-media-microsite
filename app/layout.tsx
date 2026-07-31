import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import CustomCursor from "../components/CustomCursor";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SHARP PRO MEDIA | Creative Director & Media Production",
  description: "Futuristic interactive microsite for Pro Media Creative Director. Specializing in high-end photography, cinematic film making, media production, and premium digital marketing.",
  keywords: ["Pro Media", "Creative Director", "Photography", "Film Making", "Media Production", "Digital Marketing", "Premium Creative Agency"],
  authors: [{ name: "Pro Media" }],
  metadataBase: new URL("https://pro-media.com"),
  openGraph: {
    title: "SHARP PRO MEDIA | Creative Director & Media Production",
    description: "Premium digital portfolio and links for Pro Media. Discover state-of-the-art photography and film making.",
    url: "https://pro-media.com",
    siteName: "Pro Media",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/profile.png",
        width: 800,
        height: 800,
        alt: "Pro Media Creative Director Portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SHARP PRO MEDIA | Creative Director & Media Production",
    description: "Premium digital portfolio and links for Pro Media. Discover state-of-the-art photography and film making.",
    images: ["/profile.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-dark text-white overflow-x-hidden selection:bg-rose-500 selection:text-white">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
