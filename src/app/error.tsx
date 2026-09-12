"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <main className="grid min-h-[75vh] place-items-center p-6">
      <section className="premium-panel max-w-md rounded-[28px] p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#f6c177]/25 bg-[#f6c177]/10 text-[#f6c177]"><AlertTriangle className="h-6 w-6" /></div>
        <h1 className="mt-5 text-2xl font-semibold tracking-[-.03em] text-foreground">That page needs another try.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Pairme couldn’t load this view. Your work has not been changed.</p>
        <div className="mt-6 flex justify-center gap-3"><Button onClick={reset} className="rounded-xl"><RefreshCw className="mr-2 h-4 w-4" /> Try again</Button><Button asChild variant="outline" className="rounded-xl"><Link href="/">All rooms</Link></Button></div>
      </section>
    </main>
  );
}
