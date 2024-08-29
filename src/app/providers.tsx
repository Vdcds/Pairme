"use client";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme.provider";
import { ModeToggle } from "@/components/mode.toggle";
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className=" Header m-2 ">{/* <ModeToggle></ModeToggle> */}</div>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
