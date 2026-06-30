import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import RootProvider from "@/provider/root-provider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "testproject",
  description: "A modern Next.js frontend application.",
  metadataBase: new URL("https://testproject.local"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "testproject",
    description: "A modern Next.js frontend application.",
    url: "/",
    siteName: "testproject",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable
      )}
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="min-h-full flex flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}