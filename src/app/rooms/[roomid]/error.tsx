"use client";

import { DatabaseZap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoomError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[70vh] place-items-center p-6">
      <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-2xl shadow-black/20">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary"><DatabaseZap className="h-6 w-6" /></div>
        <h1 className="mt-5 text-xl font-semibold text-white">Connecting to the room</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">The database is taking longer than usual to respond. Your room is safe—try again in a moment.</p>
        <Button onClick={reset} className="mt-6 gap-2 rounded-full"><RefreshCw className="h-4 w-4" /> Try again</Button>
      </div>
    </main>
  );
}
