import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Braces,
  Check,
  Code2,
  Github,
  MonitorUp,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { label: "All rooms", href: "/join-rooms" },
  { label: "Problem board", href: "/problems" },
  { label: "Frontend", href: "/join-rooms?tag=Frontend" },
  { label: "Backend", href: "/join-rooms?tag=Backend" },
  { label: "Systems", href: "/join-rooms?tag=Systems" },
  { label: "Mobile", href: "/join-rooms?tag=Mobile" },
  { label: "DevOps", href: "/join-rooms?tag=DevOps" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#191724] text-[#e0def4]">
      {/* HERO */}
      <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#26233a]">
        {/* subtle atmosphere — NO GRID / CHECKER TEXTURE */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[-14rem] top-[-18rem] h-[44rem] w-[44rem] rounded-full bg-[#c4a7e7]/[0.055] blur-[170px]" />

          <div className="absolute bottom-[-18rem] left-[24%] h-[38rem] w-[38rem] rounded-full bg-[#ebbcba]/[0.03] blur-[160px]" />
        </div>

        {/* FULL WIDTH */}
        <div className="relative grid min-h-[calc(100vh-64px)] w-full lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* LEFT RAIL */}
          <aside className="hidden border-r border-[#403d52]/70 px-10 py-12 lg:flex lg:flex-col lg:justify-between xl:px-12">
            <div>
              <Link href="/" className="mb-14 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#908caa] transition hover:text-[#e0def4]">
                <Code2 className="h-4 w-4 text-[#9ccfd8]" /> Pairme
              </Link>

              <nav className="space-y-3">
                {categories.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`
                      group flex items-center gap-3 py-2 text-sm transition
                      ${
                        index === 0
                          ? "text-[#e0def4]"
                          : "text-[#6e6a86] hover:text-[#e0def4]"
                      }
                    `}
                  >
                    <span
                      className={`
                        overflow-hidden text-[#ebbcba] transition-all
                        ${index === 0 ? "w-5" : "w-0 group-hover:w-5"}
                      `}
                    >
                      →
                    </span>

                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-xl border-[#524f67] bg-transparent text-[#e0def4] hover:bg-[#403d52] hover:text-[#e0def4]"
              >
                <Link href="/join-rooms">
                  Show all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <div className="mt-5 flex gap-2">
                <Link href="/problems" aria-label="Open problem board" className="grid h-10 w-10 place-items-center rounded-xl border border-[#524f67] text-[#908caa] transition hover:border-[#c4a7e7]/35 hover:text-[#e0def4]"><ArrowLeft className="h-4 w-4" /></Link>
                <Link href="/create-room" aria-label="Create a room" className="grid h-10 w-10 place-items-center rounded-xl bg-[#eb6f92] text-[#191724] transition hover:bg-[#f08cab]"><ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </aside>

          {/* MAIN HERO */}
          <div className="flex min-w-0 flex-col px-6 pb-10 pt-10 sm:px-10 lg:px-16 lg:pb-12 lg:pt-16 xl:px-24 2xl:px-32">
            {/* top meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-full border border-[#524f67] bg-[#191724]/20 px-3 py-1.5 text-[11px] font-medium text-[#908caa]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9ccfd8]" />
                Developers solving actual shit
              </div>

              <div className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#6e6a86] sm:flex">
                <Github className="h-3.5 w-3.5" />
                Repo-aware pairing
              </div>
            </div>

            {/* headline */}
            <div className="mt-16 w-full lg:mt-20">
              <div className="mb-8 flex items-center gap-5">
                <LogoMark />

                <div className="hidden h-px flex-1 bg-[#403d52] sm:block" />
              </div>

              <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
                <h1 className="text-[4rem] font-medium leading-[0.9] tracking-[-0.065em] text-[#e0def4] sm:text-[6rem] lg:text-[7.4rem] xl:text-[8.6rem] 2xl:text-[9.6rem]">
                  Pair better.
                </h1>

                <span className="pb-2 text-2xl font-medium tracking-[-0.04em] text-[#ebbcba] sm:text-4xl lg:pb-4 lg:text-5xl xl:text-6xl">
                  Ship faster.
                </span>
              </div>
            </div>

            {/* search */}
            <form action="/join-rooms" className="mt-12 w-full max-w-5xl">
              <div className="relative border-b border-[#6e6a86]/50 pb-5">
                <button type="submit" aria-label="Search rooms" className="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-xl text-[#908caa] transition hover:bg-[#403d52]/65 hover:text-[#e0def4]">
                  <Search className="h-6 w-6" />
                </button>

                <Input
                  name="q"
                  autoComplete="off"
                  placeholder="What are you stuck on?"
                  className="
                    h-auto border-0 bg-transparent px-0 py-0 pr-12
                    text-3xl font-medium tracking-[-0.04em]
                    text-[#e0def4] shadow-none
                    placeholder:text-[#6e6a86]
                    focus-visible:ring-0
                    sm:text-4xl
                    lg:text-5xl
                  "
                />
              </div>
            </form>

            <div className="mt-5 flex flex-wrap gap-2 lg:hidden">
              <Link href="/join-rooms" className="rounded-full border border-[#524f67] px-3 py-1.5 text-xs text-[#908caa] transition hover:border-[#c4a7e7]/35 hover:text-[#e0def4]">All rooms</Link>
              <Link href="/problems" className="rounded-full border border-[#524f67] px-3 py-1.5 text-xs text-[#908caa] transition hover:border-[#c4a7e7]/35 hover:text-[#e0def4]">Problems</Link>
              <Link href="/create-room" className="rounded-full bg-[#eb6f92] px-3 py-1.5 text-xs font-medium text-[#191724]">Start a room</Link>
            </div>

            {/* action row */}
            <div className="mt-8 flex w-full flex-wrap items-stretch gap-3">
              <ActionCard
                href="/problems"
                eyebrow="Explore"
                title="Browse problems"
                icon={<ArrowRight className="h-4 w-4" />}
              />

              <ActionCard
                href="/create-room"
                eyebrow="Stuck?"
                title="Start a room"
                icon={<ArrowUpRight className="h-4 w-4" />}
                wide
              >
                <div className="grid h-12 w-12 rotate-6 place-items-center rounded-full bg-[#eb6f92] text-[#191724] shadow-[0_10px_35px_rgba(235,111,146,.16)]">
                  <Asterisk className="h-6 w-6" />
                </div>
              </ActionCard>

              <ActionCard
                href="/join-rooms"
                eyebrow="Available?"
                title="Help someone"
                icon={<Users className="h-4 w-4" />}
              />
            </div>

            {/* bottom notes */}
            <div className="mt-auto grid gap-4 pt-14 sm:grid-cols-3">
              <MiniPoint
                icon={<Braces className="h-4 w-4" />}
                label="Problem first"
              >
                Start with the blocker, not the profile.
              </MiniPoint>

              <MiniPoint
                icon={<MonitorUp className="h-4 w-4" />}
                label="Pair live"
              >
                Talk, screen share, debug, ship.
              </MiniPoint>

              <MiniPoint
                icon={<Github className="h-4 w-4" />}
                label="Real context"
              >
                Repo, stack, issue, actual code.
              </MiniPoint>
            </div>
          </div>
        </div>
      </section>

      {/* LOWER EDITORIAL SECTIONS — ALSO FULL WIDTH */}
      <section className="border-t border-[#403d52]/70 bg-[#191724]">
        <div className="grid w-full lg:grid-cols-3">
          {/* POST */}
          <article className="relative min-h-[430px] overflow-hidden border-b border-[#403d52]/70 p-8 sm:p-10 lg:border-b-0 lg:border-r xl:p-12">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9ccfd8]">
                01 — Post
              </span>

              <Braces className="h-5 w-5 text-[#6e6a86]" />
            </div>

            <div className="mt-16">
              <h2 className="max-w-sm text-3xl font-medium leading-[1.05] tracking-[-0.045em] text-[#e0def4] sm:text-4xl">
                Give people
                <br />
                the actual context.
              </h2>

              <p className="mt-5 max-w-xs text-sm leading-6 text-[#908caa]">
                Repo. Stack. Problem. Enough information for another developer
                to know whether they can actually help.
              </p>
            </div>

            <div className="absolute bottom-8 left-8 right-8 rounded-[18px] border border-[#403d52] bg-[#1f1d2e] p-4 font-mono text-[11px] sm:left-10 sm:right-10 lg:left-10 lg:right-10 xl:left-12 xl:right-12">
              <TerminalLine name="repo" value="vdcds/pairme" />
              <TerminalLine name="stack" value="Next.js · Stream" />
              <TerminalLine name="problem" value="reconnect race" />
            </div>
          </article>

          {/* PAIR */}
          <article className="relative min-h-[430px] overflow-hidden border-b border-[#403d52]/70 p-8 sm:p-10 lg:border-b-0 lg:border-r xl:p-12">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ebbcba]">
                02 — Pair
              </span>

              <MonitorUp className="h-5 w-5 text-[#6e6a86]" />
            </div>

            <div className="mt-16">
              <h2 className="max-w-sm text-3xl font-medium leading-[1.05] tracking-[-0.045em] text-[#e0def4] sm:text-4xl">
                Talk through it.
                <br />
                Break things responsibly.
              </h2>

              <p className="mt-5 max-w-xs text-sm leading-6 text-[#908caa]">
                Open a focused session with video, screen sharing, reactions,
                and another developer who understands the stack.
              </p>
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between rounded-[22px] border border-[#403d52] bg-[#26233a] p-5 sm:left-10 sm:right-10 lg:left-10 lg:right-10 xl:left-12 xl:right-12">
              <div>
                <p className="text-xs font-medium text-[#e0def4]">
                  Pair session
                </p>

                <p className="mt-1 text-[11px] text-[#6e6a86]">
                  screen shared · debugging
                </p>
              </div>

              <div className="flex -space-x-2">
                <Avatar>V</Avatar>
                <Avatar>A</Avatar>
              </div>
            </div>
          </article>

          {/* SHIP */}
          <article className="flex min-h-[430px] flex-col border-[#403d52]/70 p-8 sm:p-10 xl:p-12">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f6c177]">
                03 — Ship
              </span>

              <Sparkles className="h-5 w-5 text-[#6e6a86]" />
            </div>

            <div className="mt-14">
              <h2 className="max-w-md text-3xl font-medium leading-[1.04] tracking-[-0.045em] text-[#e0def4] sm:text-4xl xl:text-[2.75rem]">
                Leave with
                <br />
                something useful.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-[#908caa]">
                A fix, a PR, notes, or at least a much clearer idea of why the
                damn thing is broken.
              </p>
            </div>

            <div className="mt-auto pt-10">
              <div className="rounded-[26px] bg-[#e0def4] p-6 text-[#191724] sm:p-7">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6e6a86]">
                      Session outcome
                    </p>

                    <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                      PR #82 ready.
                    </p>
                  </div>

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#9ccfd8]">
                    <Check className="h-5 w-5 stroke-[2.5]" />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-xs font-medium text-[#6e6a86]">
                  <span>47 min</span>
                  <span>3 notes</span>
                  <span>Would pair again</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

function LogoMark() {
  return (
    <div className="flex h-[72px] items-stretch gap-1">
      <div className="w-[72px] rounded-l-full rounded-r-[4px] bg-[#e0def4]" />
      <div className="w-[72px] rounded-br-[36px] bg-[#e0def4]" />
    </div>
  );
}

function ActionCard({
  href,
  eyebrow,
  title,
  icon,
  wide = false,
  children,
}: {
  href: string;
  eyebrow: string;
  title: string;
  icon: ReactNode;
  wide?: boolean;
  children?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`
        group flex min-h-[118px] items-end justify-between gap-6
        rounded-[22px] border border-[#524f67]
        bg-[#1f1d2e] p-4
        transition duration-200
        hover:-translate-y-1
        hover:border-[#c4a7e7]/35
        hover:bg-[#2c2940]

        ${wide ? "min-w-[270px] flex-1 xl:max-w-[430px]" : "min-w-[210px]"}
      `}
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6e6a86]">
          {eyebrow}
        </p>

        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#e0def4]">
          {title}
          {icon}
        </div>
      </div>

      {children ?? (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#524f67] text-[#908caa] transition group-hover:border-[#c4a7e7]/30 group-hover:bg-[#c4a7e7] group-hover:text-[#191724]">
          <ArrowRight className="h-4 w-4" />
        </div>
      )}
    </Link>
  );
}

function MiniPoint({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-[#403d52]/70 pt-4">
      <div className="flex items-center gap-2 text-xs font-medium text-[#e0def4]">
        <span className="text-[#9ccfd8]">{icon}</span>
        {label}
      </div>

      <p className="mt-2 max-w-[240px] text-[11px] leading-5 text-[#6e6a86]">
        {children}
      </p>
    </div>
  );
}

function TerminalLine({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex gap-4 py-1">
      <span className="w-16 shrink-0 text-[#6e6a86]">{name}</span>

      <span className="truncate text-[#9ccfd8]">{value}</span>
    </div>
  );
}

function Avatar({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#26233a] bg-[#c4a7e7] text-[11px] font-bold text-[#191724]">
      {children}
    </div>
  );
}
