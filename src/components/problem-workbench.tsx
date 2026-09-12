import { ArrowUpRight, CheckSquare2, ExternalLink, Play, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PairingProblem } from "@/lib/problems";
import { ProblemScratchpad } from "@/components/problem-scratchpad";

export function ProblemWorkbench({ problem, roomId }: { problem: PairingProblem; roomId: string }) {
  return (
    <section className="premium-panel premium-keyline overflow-hidden rounded-[26px] border border-border/80 bg-card shadow-[0_20px_56px_rgba(10,8,18,.24)]">
      <div className="border-b border-border/80 px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-[#9ccfd8]">
            <Sparkles className="h-3.5 w-3.5" /> Shared problem brief
          </div>
          <Badge className="rounded-full border border-[#c4a7e7]/20 bg-[#c4a7e7]/10 px-2.5 py-1 text-[#c4a7e7] hover:bg-[#c4a7e7]/10">
            {problem.source}
          </Badge>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">{problem.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{problem.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-xl border-border bg-background/30 text-foreground hover:bg-secondary"><a href={problem.url} target="_blank" rel="noreferrer">Run on {problem.source} <Play className="ml-2 h-4 w-4" /></a></Button>
            <Button asChild className="rounded-xl bg-[#c4a7e7] text-[#191724] hover:bg-[#d4bdf0]"><a href={problem.url} target="_blank" rel="noreferrer">Submit <Send className="ml-2 h-4 w-4" /></a></Button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-end sm:px-7">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#908caa]">Jam plan</p>
          <p className="mt-2 flex gap-2 text-sm leading-6 text-foreground"><CheckSquare2 className="mt-0.5 h-4 w-4 shrink-0 text-[#9ccfd8]" />{problem.pairingPrompt}</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Badge variant="secondary" className="rounded-full border border-[#f6c177]/20 bg-[#f6c177]/10 text-[#f6c177]">{problem.difficulty}</Badge>
          {problem.tags.map((tag) => <Badge key={tag} variant="secondary" className="rounded-full border border-border bg-secondary/60 text-muted-foreground">{tag}</Badge>)}
        </div>
      </div>
      {problem.statement && (
        <div className="border-t border-border/80 px-5 py-6 sm:px-7">
          <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#ebbcba]">Problem statement</p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-foreground">{problem.statement.description}</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-2xl border border-border bg-background/30 p-4"><p className="text-xs font-semibold text-foreground">Constraints</p><ul className="mt-2 space-y-1.5 text-sm leading-6 text-muted-foreground">{problem.statement.constraints.map((constraint) => <li key={constraint}>• {constraint}</li>)}</ul></div>
            <div className="rounded-2xl border border-border bg-background/30 p-4"><p className="text-xs font-semibold text-foreground">Examples</p><div className="mt-3 space-y-3">{problem.statement.examples.map((example) => <div key={example.input} className="font-mono text-xs leading-6 text-muted-foreground"><p><span className="text-[#9ccfd8]">Input:</span> {example.input}</p><p><span className="text-[#f6c177]">Output:</span> {example.output}</p>{example.explanation && <p className="font-sans text-sm leading-5 text-muted-foreground">{example.explanation}</p>}</div>)}</div></div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><ExternalLink className="h-3.5 w-3.5 text-[#9ccfd8]" />Run and Submit open the official {problem.source} page, where your own platform account handles execution and submission.</p>
        </div>
      )}
      <ProblemScratchpad roomId={roomId} />
      <div className="flex items-center justify-end border-t border-border/70 px-5 py-3 text-xs text-muted-foreground sm:px-7">
        Keep this brief open while you talk, sketch, screen share, and ship. <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 text-[#9ccfd8]" />
      </div>
    </section>
  );
}
