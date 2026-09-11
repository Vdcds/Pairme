import { Room } from "@prisma/client";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import {
  ArrowUpRight,
  Braces,
  Code2,
  Edit3,
  Radio,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { getRooms, deleteRoom } from "@/lib/data-fecther";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const languageMarks: Record<string, string> = {
  JavaScript: "JS",
  TypeScript: "TS",
  Python: "PY",
  Java: "JV",
  Go: "GO",
  Rust: "RS",
};

export default async function Home({ searchParams }: { searchParams: { search?: string } }) {
  const rooms = await getRooms(searchParams.search);

  async function handleDeleteRoom(roomId: string) {
    "use server";
    await deleteRoom(roomId);
    revalidatePath("/");
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <section data-ui="hero" className="relative mx-auto max-w-7xl px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        <div className="pointer-events-none absolute left-[-14rem] top-[-16rem] h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-[120px]" />
        <div className="relative grid gap-12 lg:grid-cols-[1.12fr_.88fr] lg:items-center">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-3 py-1.5 text-xs font-semibold text-[#ebbcba]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Developers available to pair now
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-7xl">
              Find your next
              <span className="block text-primary">pairing session.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Bring the problem. Pair with a developer who understands the stack. Leave with working code and a clearer path forward.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rose-gradient h-12 gap-2 rounded-2xl border-0 px-6 font-semibold text-primary-foreground shadow-[0_14px_34px_rgba(235,111,146,.18)] hover:opacity-95">
                <Link href="/create-room">Start a room <ArrowUpRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-2xl border-border bg-card/55 px-6 text-foreground hover:border-accent/40 hover:bg-secondary hover:text-foreground">
                <a href="#rooms">Browse open rooms</a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="premium-panel premium-keyline overflow-hidden rounded-[28px]">
              <div className="flex items-center justify-between border-b border-border/80 px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold"><Radio className="h-4 w-4 text-[#9ccfd8]" /> The pairing loop</div>
                <span className="rounded-full border border-[#9ccfd8]/20 bg-[#31748f]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9ccfd8]">Live</span>
              </div>
              <div className="space-y-2.5 p-4">
                {[
                  { icon: Braces, step: "01", label: "Frame the problem", detail: "Share the stack, repo, and the blocker." },
                  { icon: Users, step: "02", label: "Choose the right pair", detail: "Accept a focused request from another developer." },
                  { icon: Sparkles, step: "03", label: "Solve it live", detail: "Open the room, share the screen, and ship." },
                ].map(({ icon: Icon, step, label, detail }) => (
                  <div key={step} className="group flex gap-4 rounded-2xl border border-border/70 bg-background/35 p-4 transition hover:border-accent/35 hover:bg-secondary/60">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-accent"><Icon className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-[10px] font-bold tracking-wider text-primary">{step}</span><p className="text-sm font-semibold text-foreground">{label}</p></div><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-border/80 px-5 py-4 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-[#9ccfd8]" /> Calls open only after a pairing request is accepted.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="rooms" className="border-y border-border/80 bg-[#171520]/65">
        <div className="mx-auto max-w-7xl px-5 py-11 sm:px-8 sm:py-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#ebbcba]">Room directory</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-foreground">A good session starts with context.</h2>
            </div>
            <p className="rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"} {searchParams.search ? `matching “${searchParams.search}”` : "open now"}
            </p>
          </div>

          {rooms.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room: Room) => (
                <Card data-ui="room-card" key={room.id} className="group premium-keyline flex min-h-[280px] flex-col overflow-hidden border-border/80 bg-card/85 shadow-[0_18px_46px_rgba(10,8,18,.18)] transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_58px_rgba(10,8,18,.3)]">
                  <CardHeader className="pb-3">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-xs font-bold text-primary">{languageMarks[room.Language] ?? "</>"}</span>
                      <Badge variant="secondary" className="rounded-full border border-border bg-secondary px-2.5 py-1 text-muted-foreground">{room.Language}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2 text-xl leading-7 tracking-[-0.02em] text-foreground">{room.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-5">
                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{room.description || "A working session looking for a second set of eyes."}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5">{room.Roomtags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-[#c4a7e7]/15 bg-[#c4a7e7]/[0.07] px-2.5 py-1 text-[11px] font-medium text-[#c4a7e7]">{tag}</span>)}</div>
                  </CardContent>
                  <CardFooter className="gap-2 border-t border-border/70 bg-background/20 pt-4">
                    <Button asChild className="flex-1 gap-2 rounded-xl bg-foreground font-semibold text-background hover:bg-primary hover:text-primary-foreground"><Link href={`/rooms/${room.id}`}>View room <ArrowUpRight className="h-4 w-4" /></Link></Button>
                    <Button asChild size="icon" variant="outline" className="rounded-xl border-border bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"><Link href={`/edit-room/${room.id}`} aria-label={`Edit ${room.name}`}><Edit3 className="h-4 w-4" /></Link></Button>
                    <form action={handleDeleteRoom.bind(null, room.id)}><Button type="submit" size="icon" variant="ghost" className="rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Delete ${room.name}`}><Trash2 className="h-4 w-4" /></Button></form>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="premium-keyline border-dashed border-border bg-card/65">
              <CardContent className="py-20 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/20 bg-primary/10"><Code2 className="h-6 w-6 text-primary" /></div><h3 className="mt-5 text-lg font-semibold text-foreground">No rooms found</h3><p className="mt-2 text-sm text-muted-foreground">Start with a clear problem and invite the right person in.</p><Button asChild className="mt-5 rounded-xl"><Link href="/create-room">Create the first room</Link></Button></CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
