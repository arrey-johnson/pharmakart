import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PharmaKart - Your Trusted Pharmacy Marketplace",
  description: "Get genuine medicines from licensed pharmacies in Douala, delivered in 1–2 hours.",
  keywords: ["pharmacy", "medicines", "Douala", "Cameroon", "delivery", "healthcare"],
  icons: {
    icon: "/pk-brand-icon-colored.svg",
    shortcut: "/pk-brand-icon-colored.svg",
    apple: "/pk-brand-icon-colored.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
