import { getRoom, deleteRoom } from "@/lib/data-fecther";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Code2, Github, ShieldAlert, Tags, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ClientVideoPlayer = dynamic(() => import("@/components/video-player").then((mod) => mod.ClientVideoPlayer), { ssr: false });

export default async function RoomPage({ params }: { params: { roomid: string } }) {
  const room = await getRoom(params.roomid);
  const session = await getServerSession(authOptions);

  if (!room) return <div className="grid min-h-[70vh] place-items-center p-6"><Card className="border-border bg-card"><CardContent className="p-8 text-center"><Code2 className="mx-auto h-6 w-6 text-primary" /><p className="mt-3 font-medium text-white">Room not found</p></CardContent></Card></div>;

  if (!session?.user?.id) return <div className="grid min-h-[70vh] place-items-center p-6"><Card className="max-w-sm border-border bg-card"><CardContent className="p-8 text-center"><ShieldAlert className="mx-auto h-6 w-6 text-primary" /><p className="mt-3 font-medium text-white">Sign in to join this room.</p><p className="mt-2 text-sm text-muted-foreground">Your identity keeps the call and room activity accountable.</p></CardContent></Card></div>;

  async function handleDeleteRoom() {
    "use server";
    await deleteRoom(params.roomid);
    revalidatePath("/");
    redirect("/");
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-primary"><span className="h-2 w-2 rounded-full bg-primary" /> Live room</div><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{room.name}</h1></div>
        <Badge variant="secondary" className="bg-white/[.06] px-3 py-1.5 text-muted-foreground">{room.Language}</Badge>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/30"><ClientVideoPlayer room={room} /></section>
        <aside className="space-y-4">
          <Card className="border-border bg-card/80"><CardContent className="space-y-6 p-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Session brief</p><p className="mt-2 text-sm leading-6 text-white/85">{room.description}</p></div><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Focus areas</p><div className="mt-2 flex flex-wrap gap-2">{room.Roomtags.map((tag) => <Badge key={tag} className="gap-1 bg-primary/10 text-primary hover:bg-primary/15"><Tags className="h-3 w-3" />{tag}</Badge>)}</div></div>{room.GithubRepo && <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Repository</p><a href={room.GithubRepo} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 break-all text-sm text-primary hover:text-white"><Github className="h-4 w-4 shrink-0" /> {room.GithubRepo.replace(/^https?:\/\//, "")} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a></div>}</CardContent></Card>
          <form action={handleDeleteRoom}><Button type="submit" variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete room</Button></form>
        </aside>
      </div>
    </main>
  );
}
