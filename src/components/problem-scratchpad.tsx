"use client";

import { useEffect, useState } from "react";
import { Check, Clipboard, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const starterMarkdown = `# Pairing notes

## Approach
- 

## Invariant / insight
- 

## Test cases
- 

## Next step
- 
`;

export function ProblemScratchpad({ roomId }: { roomId: string }) {
  const storageKey = `pairme:room:${roomId}:scratchpad`;
  const [markdown, setMarkdown] = useState(starterMarkdown);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) setMarkdown(saved);
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, markdown);
  }, [markdown, ready, storageKey]);

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="border-t border-border/80 px-5 py-6 sm:px-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.18em] text-[#9ccfd8]"><FileText className="h-3.5 w-3.5" /> Markdown scratchpad</p>
          <p className="mt-2 text-sm text-muted-foreground">Autosaved in this browser for this room. Copy it into the call chat or your repo when you are done.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setMarkdown(starterMarkdown)} className="rounded-xl border-border bg-background/30 text-muted-foreground hover:bg-secondary hover:text-foreground"><RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset</Button>
          <Button type="button" size="sm" onClick={copyMarkdown} className="rounded-xl bg-[#c4a7e7] text-[#191724] hover:bg-[#d4bdf0]">{copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Clipboard className="mr-1.5 h-3.5 w-3.5" />}{copied ? "Copied" : "Copy .md"}</Button>
        </div>
      </div>
      <textarea
        value={markdown}
        onChange={(event) => setMarkdown(event.target.value)}
        spellCheck={false}
        aria-label="Markdown scratchpad"
        className="mt-4 min-h-[260px] w-full resize-y rounded-2xl border border-border bg-[#191724]/55 p-4 font-mono text-[13px] leading-6 text-[#e0def4] outline-none transition placeholder:text-[#6e6a86] focus:border-[#c4a7e7]/45 focus:ring-2 focus:ring-[#c4a7e7]/10"
      />
    </section>
  );
}
