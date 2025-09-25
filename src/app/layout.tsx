// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic"; // don't pre-render at build
export const revalidate = 0; // no ISR
export const fetchCache = "force-no-store"; // ensure fetches don't cache at build

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Document Approval System",
  description: "A comprehensive document approval workflow management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
