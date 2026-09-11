import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Pairme — Find your next pairing session",
  description: "A focused place for developers to pair, ship, and learn together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Suspense fallback={<div className="h-16 border-b border-border" />}>
            <Navbar />
          </Suspense>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
