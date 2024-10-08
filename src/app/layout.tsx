import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModeToggle } from "@/components/mode.toggle";
import { Providers } from "./providers";
import Navbar from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pairme",
  description: "A pair Programming video conference app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className=" Header m-2 ">
            <Navbar></Navbar>
            <Toaster></Toaster>
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
