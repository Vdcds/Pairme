import Link from "next/link";
import { ArrowUpRight, CalendarDays, Code2, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pairingProblems, type PairingProblem } from "@/lib/problems";

const sourceStyles: Record<PairingProblem["source"], string> = {
  LeetCode: "border-[#f6c177]/20 bg-[#f6c177]/10 text-[#f6c177]",
  Codeforces: "border-[#9ccfd8]/20 bg-[#9ccfd8]/10 text-[#9ccfd8]",
  "Advent of Code": "border-[#ebbcba]/20 bg-[#ebbcba]/10 text-[#ebbcba]",
};

export default function ProblemsPage() {
  const interviewProblems = pairingProblems.filter((problem) => problem.kind !== "calendar" && problem.kind !== "season");
  const events = pairingProblems.filter((problem) => problem.kind === "calendar" || problem.kind === "season");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#191724] text-[#e0def4]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[-16rem] h-[35rem] w-[35rem] rounded-full bg-[#c4a7e7]/[0.075] blur-[150px]" />
        <div className="absolute right-[-12rem] top-[26rem] h-[30rem] w-[30rem] rounded-full bg-[#9ccfd8]/[0.045] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-[#403d52]/70 bg-[#1f1d2e]/85 px-6 py-8 shadow-[0_28px_90px_rgba(0,0,0,.22)] sm:px-9 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#9ccfd8]/20 bg-[#9ccfd8]/[0.08] px-3 py-1.5 text-xs font-medium text-[#9ccfd8]">
                <Sparkles className="h-3.5 w-3.5" /> Pairing prompts, not a content feed
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-[#e0def4] sm:text-5xl lg:text-6xl">
                Find the problem. <span className="text-[#ebbcba]">Start the room.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#908caa]">
                Pick a proven interview problem, a contest calendar, or an Advent puzzle. Pairme turns it into a focused two-person session with the brief pinned right below the call.
              </p>
            </div>
            <div className="rounded-[22px] border border-[#403d52]/70 bg-[#191724]/70 p-5 lg:max-w-xs">
              <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#6e6a86]">The pairing loop</p>
              <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#e0def4]">Choose → brief → call → solve.</p>
              <p className="mt-2 text-sm leading-6 text-[#908caa]">No endless scrolling. Every card gives you a concrete thing to work on together.</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-[#f6c177]"><Code2 className="h-3.5 w-3.5" /> The essential set</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#e0def4]">Interview classics worth talking through.</h2>
            </div>
            <p className="text-sm text-[#908caa]">{interviewProblems.length} curated prompts</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {interviewProblems.map((problem) => <ProblemCard key={problem.slug} problem={problem} />)}
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-[#9ccfd8]"><CalendarDays className="h-3.5 w-3.5" /> Events and recurring rituals</div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {events.map((problem) => <ProblemCard key={problem.slug} problem={problem} event />)}
          </div>
          <p className="mt-4 text-xs leading-5 text-[#6e6a86]">Contest dates change often, so the Codeforces card always opens the live official calendar instead of showing stale dates here.</p>
        </section>
      </div>
    </main>
  );
}

function ProblemCard({ problem, event = false }: { problem: PairingProblem; event?: boolean }) {
  return (
    <article className={`group relative flex min-h-[290px] flex-col overflow-hidden rounded-[26px] border border-[#403d52]/70 bg-[#1f1d2e] p-5 shadow-[0_16px_46px_rgba(0,0,0,.12)] transition hover:-translate-y-1 hover:border-[#c4a7e7]/30 hover:bg-[#232033] ${event ? "lg:min-h-[250px]" : ""}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#c4a7e7]/[0.06] to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-4">
        <Badge className={`rounded-full border px-2.5 py-1 text-[11px] font-medium hover:bg-inherit ${sourceStyles[problem.source]}`}>{problem.source}</Badge>
        <Badge variant="secondary" className="rounded-full border border-[#403d52] bg-[#26233a] text-[11px] text-[#908caa]">{problem.difficulty}</Badge>
      </div>
      <div className="relative mt-5">
        <h3 className="text-[22px] font-semibold leading-[1.18] tracking-[-0.035em] text-[#e0def4]">{problem.title}</h3>
        <p className="mt-3 text-sm leading-6 text-[#908caa]">{problem.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">{problem.tags.map((tag) => <span key={tag} className="rounded-md border border-[#403d52]/60 bg-[#26233a]/70 px-2 py-1 text-[10px] font-medium text-[#908caa]">#{tag}</span>)}</div>
      </div>
      <div className="relative mt-auto flex gap-2 pt-6">
        <Button asChild className="h-10 flex-1 rounded-xl bg-[#c4a7e7] font-semibold text-[#191724] shadow-none hover:bg-[#d4bdf0]">
          <Link href={`/create-room?problem=${encodeURIComponent(problem.slug)}`}>Start a pairing room <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl border-[#403d52] bg-[#26233a]/70 text-[#908caa] hover:bg-[#403d52] hover:text-[#e0def4]">
          <a href={problem.url} target="_blank" rel="noreferrer" aria-label={`Open ${problem.title}`}><ExternalLink className="h-4 w-4" /></a>
        </Button>
      </div>
    </article>
  );
}
