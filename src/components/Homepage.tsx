import { Room } from "@prisma/client";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { ArrowUpRight, Code2, Edit3, Radio, Terminal, Trash2, Users } from "lucide-react";
import { getRooms, deleteRoom } from "@/lib/data-fecther";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const languageMarks: Record<string, string> = {
  JavaScript: "JS", TypeScript: "TS", Python: "PY", Java: "JV", Go: "GO", Rust: "RS",
};

export default async function Home({ searchParams }: { searchParams: { search?: string } }) {
  const rooms = await getRooms(searchParams.search);

  async function handleDeleteRoom(roomId: string) {
    "use server";
    await deleteRoom(roomId);
    revalidatePath("/");
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Live collaboration, without the noise
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.055em] text-white sm:text-7xl">
              Find the right person.<br /><span className="text-primary">Ship the next thing.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Pairme is a focused room directory for developers who want to solve, review, and build together in real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 rounded-full px-6 font-semibold">
                <Link href="/create-room">Start a room <ArrowUpRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-border bg-white/[.03] px-6 text-white hover:bg-white/[.08] hover:text-white">
                <a href="#rooms">Browse active rooms</a>
              </Button>
            </div>
          </div>
          <Card className="overflow-hidden border-border bg-card/80 shadow-2xl shadow-black/30 backdrop-blur">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-medium"><Radio className="h-4 w-4 text-primary" /> How Pairme works</div>
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">Fast lane</span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border">
                {[{ icon: Terminal, label: "Create", detail: "Set the brief" }, { icon: Users, label: "Match", detail: "Find your pair" }, { icon: Code2, label: "Build", detail: "Meet & ship" }].map(({ icon: Icon, label, detail }, index) => (
                  <div className="p-5" key={label}><span className="text-xs text-muted-foreground">0{index + 1}</span><Icon className="my-5 h-5 w-5 text-primary" /><p className="font-medium text-white">{label}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="rooms" className="border-y border-border bg-black/20">
        <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-sm font-medium text-primary">ROOM DIRECTORY</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">Ready when you are.</h2></div>
            <p className="text-sm text-muted-foreground">{rooms.length} {rooms.length === 1 ? "room" : "rooms"} {searchParams.search ? `matching “${searchParams.search}”` : "available"}</p>
          </div>
          {rooms.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room: Room) => (
              <Card key={room.id} className="group flex min-h-[255px] flex-col border-border bg-card transition hover:-translate-y-1 hover:border-primary/60 hover:bg-[#17171d]">
                <CardHeader className="pb-3">
                  <div className="mb-5 flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-xs font-bold text-primary">{languageMarks[room.Language] ?? "</>"}</span><Badge variant="secondary" className="bg-white/[.06] text-muted-foreground">{room.Language}</Badge></div>
                  <CardTitle className="line-clamp-1 text-xl text-white">{room.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-4"><p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{room.description || "A working session looking for a second set of eyes."}</p><p className="mt-4 line-clamp-1 text-xs font-medium text-primary/90">#{room.Roomtags}</p></CardContent>
                <CardFooter className="gap-2 border-t border-border pt-4">
                  <Button asChild className="flex-1 gap-2 bg-white text-black hover:bg-primary"><Link href={`/rooms/${room.id}`}>Join session <ArrowUpRight className="h-4 w-4" /></Link></Button>
                  <Button asChild size="icon" variant="outline" className="border-border bg-transparent text-muted-foreground hover:text-white"><Link href={`/edit-room/${room.id}`} aria-label={`Edit ${room.name}`}><Edit3 className="h-4 w-4" /></Link></Button>
                  <form action={handleDeleteRoom.bind(null, room.id)}><Button type="submit" size="icon" variant="ghost" className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Delete ${room.name}`}><Trash2 className="h-4 w-4" /></Button></form>
                </CardFooter>
              </Card>
            ))}
          </div> : <Card className="border-dashed border-border bg-card/60"><CardContent className="py-16 text-center"><Code2 className="mx-auto h-7 w-7 text-primary" /><h3 className="mt-4 font-medium text-white">No rooms found</h3><p className="mt-2 text-sm text-muted-foreground">Be the person who starts the next useful session.</p><Button asChild variant="link" className="mt-3 text-primary"><Link href="/create-room">Create a room</Link></Button></CardContent></Card>}
        </div>
      </section>
    </main>
  );
}
