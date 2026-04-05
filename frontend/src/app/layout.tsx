import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Apollo Sentinel | AI-Powered DeFi Risk Management",
  description:
    "AI-powered JIT rescue system for DeFi positions on HashKey Chain. Prevents destructive liquidations through ZKID-verified creditworthiness.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Apollo Sentinel — Fair DeFi on HashKey Chain",
    description:
      "AI-powered JIT rescue system that prevents destructive liquidations through ZKID-verified creditworthiness.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apollo Sentinel — Fair DeFi on HashKey Chain",
    description:
      "AI-powered JIT rescue system that prevents destructive liquidations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0c1324] text-[#dce1fb]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
