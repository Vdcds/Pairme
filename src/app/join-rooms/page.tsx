// app/join-room/page.tsx

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Code2,
  Github,
  Hash,
  Layers3,
  Plus,
  Search,
  Sparkles,
  TerminalSquare,
  Users,
  WandSparkles,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type JoinRoomPageProps = {
  searchParams?: {
    q?: string;
    language?: string;
    tag?: string;
  };
};

export default async function JoinRoomPage({
  searchParams,
}: JoinRoomPageProps) {
  const query = searchParams?.q?.trim() ?? "";
  const language = searchParams?.language?.trim() ?? "";
  const tag = searchParams?.tag?.trim() ?? "";

  const rooms = await prisma.room.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  Language: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  GithubRepo: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
        language
          ? {
              Language: {
                equals: language,
                mode: "insensitive",
              },
            }
          : {},
        tag
          ? {
              Roomtags: {
                has: tag,
              },
            }
          : {},
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allRooms = await prisma.room.findMany({
    select: {
      Language: true,
      Roomtags: true,
    },
  });

  const languages = Array.from(
    new Set(
      allRooms
        .map((room) => room.Language)
        .filter((value): value is string => Boolean(value)),
    ),
  ).slice(0, 8);

  const tagFrequency = new Map<string, number>();

  allRooms.forEach((room) => {
    room.Roomtags?.filter((roomTag) => !roomTag.startsWith("problem:")).forEach((roomTag) => {
      tagFrequency.set(roomTag, (tagFrequency.get(roomTag) ?? 0) + 1);
    });
  });

  const popularTags = Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([roomTag]) => roomTag);

  const totalRooms = allRooms.length;
  const languageCount = languages.length;

  const hasFilters = Boolean(query || language || tag);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#191724] text-[#e0def4]">
      {/* background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-280px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-[#c4a7e7]/[0.08] blur-[160px]" />

        <div className="absolute right-[-180px] top-[360px] h-[440px] w-[440px] rounded-full bg-[#ebbcba]/[0.055] blur-[130px]" />

        <div className="absolute bottom-[-300px] left-[-140px] h-[520px] w-[520px] rounded-full bg-[#9ccfd8]/[0.04] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(224,222,244,.3) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] border border-[#403d52]/70 bg-[#1f1d2e]/80 px-6 py-8 shadow-[0_30px_100px_rgba(0,0,0,.20)] backdrop-blur-xl sm:px-8 sm:py-10 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,167,231,.12),transparent_35%)]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c4a7e7]/15 bg-[#c4a7e7]/[0.07] px-3 py-1.5 text-xs font-medium text-[#c4a7e7]">
                <WandSparkles className="h-3.5 w-3.5" />
                Find your next pairing session
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-[#e0def4] sm:text-5xl lg:text-[58px] lg:leading-[1.02]">
                Find a problem.
                <span className="block text-[#ebbcba]">Solve it together.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#908caa] sm:text-base">
                Browse real problems developers are working on right now. Pick
                something in your wheelhouse, jump into the room, and pair on
                the actual issue.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <StatPill
                  icon={<Layers3 className="h-4 w-4" />}
                  value={totalRooms}
                  label="rooms"
                />

                <StatPill
                  icon={<Code2 className="h-4 w-4" />}
                  value={languageCount}
                  label="stacks"
                />

                <div className="flex items-center gap-2 rounded-xl border border-[#403d52]/70 bg-[#26233a]/60 px-3.5 py-2 text-xs text-[#908caa]">
                  <Sparkles className="h-4 w-4 text-[#f6c177]" />
                  Human debugging &gt; suffering alone
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#403d52]/70 bg-[#191724]/65 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6e6a86]">
                Got your own chaos?
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#e0def4]">
                Throw a problem into the room.
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#908caa]">
                Add the brief, repo, stack and context. Let someone useful find
                you.
              </p>

              <Button
                asChild
                className="mt-5 h-11 w-full rounded-xl bg-[#c4a7e7] font-medium text-[#191724] shadow-none hover:bg-[#d4bdf0]"
              >
                <Link href="/create-room">
                  <Plus className="mr-2 h-4 w-4" />
                  Create a room
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section className="mt-8">
          <form
            action="/join-rooms"
            className="relative rounded-[22px] border border-[#403d52]/70 bg-[#1f1d2e]/80 p-2 shadow-[0_18px_50px_rgba(0,0,0,.14)] backdrop-blur-xl"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#6e6a86]" />

              <Input
                name="q"
                defaultValue={query}
                placeholder="Search auth bugs, Go, Rust, Next.js, WebSockets..."
                className="h-12 rounded-[16px] border-0 bg-[#191724]/80 pl-11 pr-28 text-sm text-[#e0def4] shadow-none placeholder:text-[#6e6a86] focus-visible:ring-1 focus-visible:ring-[#c4a7e7]/30"
              />

              <Button
                type="submit"
                className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-xl bg-[#26233a] px-4 text-xs font-medium text-[#e0def4] shadow-none hover:bg-[#403d52]"
              >
                Search
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        </section>

        {/* FILTER BAR */}
        {(languages.length > 0 || popularTags.length > 0) && (
          <section className="mt-6 rounded-[22px] border border-[#403d52]/60 bg-[#1f1d2e]/60 p-4">
            {languages.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 flex items-center gap-2 text-xs font-medium text-[#6e6a86]">
                  <Braces className="h-3.5 w-3.5" />
                  Stack
                </span>

                {languages.map((item) => (
                  <FilterChip
                    key={item}
                    active={language === item}
                    href={buildFilterUrl({
                      q: query,
                      language: language === item ? undefined : item,
                      tag,
                    })}
                  >
                    {item}
                  </FilterChip>
                ))}
              </div>
            )}

            {popularTags.length > 0 && (
              <>
                <div className="my-4 h-px bg-[#403d52]/50" />

                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 flex items-center gap-2 text-xs font-medium text-[#6e6a86]">
                    <Hash className="h-3.5 w-3.5" />
                    Popular
                  </span>

                  {popularTags.map((item) => (
                    <FilterChip
                      key={item}
                      active={tag === item}
                      href={buildFilterUrl({
                        q: query,
                        language,
                        tag: tag === item ? undefined : item,
                      })}
                    >
                      {item}
                    </FilterChip>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* RESULTS HEADER */}
        <section className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TerminalSquare className="h-4 w-4 text-[#9ccfd8]" />

              <h2 className="text-sm font-semibold text-[#e0def4]">
                {hasFilters
                  ? "Filtered rooms"
                  : "Rooms looking for another brain"}
              </h2>
            </div>

            <p className="mt-1.5 text-xs text-[#6e6a86]">
              {rooms.length} {rooms.length === 1 ? "problem" : "problems"}{" "}
              waiting for company
            </p>
          </div>

          {hasFilters && (
            <Link
              href="/join-rooms"
              className="text-xs font-medium text-[#908caa] transition hover:text-[#e0def4]"
            >
              Clear all filters
            </Link>
          )}
        </section>

        {/* EMPTY */}
        {rooms.length === 0 && (
          <section className="mt-6 overflow-hidden rounded-[28px] border border-dashed border-[#403d52] bg-[#1f1d2e]/65">
            <div className="grid min-h-[360px] place-items-center px-6 py-14">
              <div className="max-w-md text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#403d52]/70 bg-[#26233a] text-[#c4a7e7]">
                  <Search className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-xl font-semibold tracking-tight text-[#e0def4]">
                  Nada. Zero. The void.
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#908caa]">
                  Nothing matched those filters. Change the stack, search
                  something else, or become the chaos yourself.
                </p>

                <div className="mt-6 flex justify-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-[#403d52] bg-transparent text-[#e0def4] hover:bg-[#26233a]"
                  >
                    <Link href="/join-rooms">Reset</Link>
                  </Button>

                  <Button
                    asChild
                    className="rounded-xl bg-[#c4a7e7] text-[#191724] hover:bg-[#d4bdf0]"
                  >
                    <Link href="/create-room">Create room</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ROOM GRID */}
        {rooms.length > 0 && (
          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room, index) => {
              const tags = (room.Roomtags ?? []).filter((roomTag) => !roomTag.startsWith("problem:"));

              return (
                <article
                  key={room.id}
                  className="
                    group relative flex min-h-[350px] flex-col overflow-hidden
                    rounded-[26px]
                    border border-[#403d52]/70
                    bg-[#1f1d2e]
                    p-5
                    shadow-[0_16px_50px_rgba(0,0,0,.12)]
                    transition duration-200
                    hover:-translate-y-1
                    hover:border-[#c4a7e7]/25
                    hover:bg-[#232033]
                    hover:shadow-[0_24px_70px_rgba(0,0,0,.18)]
                  "
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#c4a7e7]/[0.045] to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="relative">
                    {/* top metadata */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#9ccfd8]/15 bg-[#9ccfd8]/[0.06] px-2.5 py-1.5 text-[11px] font-medium text-[#9ccfd8]">
                          <Code2 className="h-3.5 w-3.5" />
                          {room.Language}
                        </span>

                        {room.ZenLevel && (
                          <span className="rounded-lg border border-[#f6c177]/15 bg-[#f6c177]/[0.05] px-2.5 py-1.5 text-[11px] font-medium text-[#f6c177]">
                            {room.ZenLevel}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#6e6a86]">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* problem */}
                    <h3 className="mt-5 line-clamp-2 text-[21px] font-semibold leading-[1.25] tracking-[-0.025em] text-[#e0def4]">
                      {room.name}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#908caa]">
                      {room.description ||
                        "No problem brief yet. Apparently we're going in blind. Bold strategy."}
                    </p>

                    {/* tags */}
                    {tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {tags.slice(0, 4).map((roomTag) => (
                          <span
                            key={roomTag}
                            className="rounded-md border border-[#403d52]/50 bg-[#26233a]/80 px-2 py-1 text-[10px] font-medium text-[#908caa]"
                          >
                            #{roomTag}
                          </span>
                        ))}

                        {tags.length > 4 && (
                          <span className="px-1 py-1 text-[10px] text-[#6e6a86]">
                            +{tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* bottom */}
                  <div className="relative mt-auto pt-6">
                    <div className="mb-4 h-px bg-[#403d52]/50" />

                    {room.GithubRepo ? (
                      <div className="mb-4 flex items-center gap-2 text-xs text-[#6e6a86]">
                        <Github className="h-4 w-4 shrink-0 text-[#908caa]" />

                        <span className="truncate">
                          {cleanRepoName(room.GithubRepo)}
                        </span>
                      </div>
                    ) : (
                      <div className="mb-4 flex items-center gap-2 text-xs text-[#6e6a86]">
                        <Github className="h-4 w-4" />
                        No repository attached
                      </div>
                    )}

                    <Link
                      href={`/rooms/${room.id}`}
                      className="
                        flex h-11 w-full items-center justify-between
                        rounded-xl border border-[#403d52]/70
                        bg-[#26233a]/70 px-4
                        text-sm font-medium text-[#e0def4]
                        transition
                        hover:border-[#c4a7e7]/25
                        hover:bg-[#c4a7e7]
                        hover:text-[#191724]
                      "
                    >
                      <span>Inspect problem</span>

                      <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#403d52]/70 bg-[#26233a]/60 px-3.5 py-2 text-xs">
      <span className="text-[#9ccfd8]">{icon}</span>
      <span className="font-semibold text-[#e0def4]">{value}</span>
      <span className="text-[#6e6a86]">{label}</span>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`
        rounded-lg border px-2.5 py-1.5 text-[11px] font-medium
        transition

        ${
          active
            ? "border-[#c4a7e7]/30 bg-[#c4a7e7]/15 text-[#c4a7e7]"
            : "border-[#403d52]/60 bg-[#26233a]/60 text-[#908caa] hover:border-[#c4a7e7]/20 hover:text-[#e0def4]"
        }
      `}
    >
      {children}
    </Link>
  );
}

function buildFilterUrl({
  q,
  language,
  tag,
}: {
  q?: string;
  language?: string;
  tag?: string;
}) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (language) params.set("language", language);
  if (tag) params.set("tag", tag);

  const value = params.toString();

  return value ? `/join-rooms?${value}` : "/join-rooms";
}

function cleanRepoName(repo: string) {
  try {
    const url = new URL(repo);

    return url.pathname.replace(/^\/|\/$/g, "");
  } catch {
    return repo;
  }
}
