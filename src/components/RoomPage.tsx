import { getRoom, deleteRoom } from "@/lib/data-fecther";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Code2,
  Github,
  LockKeyhole,
  Radio,
  Tags,
  Trash2,
  Users,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RoomRequestControls } from "@/components/room-request-controls";
import { ProblemWorkbench } from "@/components/problem-workbench";
import { getPairingProblem } from "@/lib/problems";
import { ClientVideoPlayer } from "@/components/video-player";

export default async function RoomPage({ params }: { params: Promise<{ roomid: string }> }) {
  const { roomid } = await params;
  const room = await getRoom(roomid);
  const currentUser = await getCurrentUser();

  if (!room) {
    return (
      <div className="grid min-h-[72vh] place-items-center p-6">
        <Card className="premium-panel rounded-3xl"><CardContent className="p-10 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10"><Code2 className="h-6 w-6 text-primary" /></div><p className="mt-4 font-semibold text-foreground">Room not found</p><Button asChild variant="link" className="mt-2 text-primary"><Link href="/">Back to rooms</Link></Button></CardContent></Card>
      </div>
    );
  }

  const viewerId = currentUser?.id;
  const isOwner = room.userId === viewerId;
  const isParticipant = Boolean(viewerId && room.participants.some((participant) => participant.userId === viewerId));
  const canEnterCall = isOwner || isParticipant;
  const ownRequest = viewerId ? room.joinRequests.find((request) => request.userId === viewerId) : undefined;
  const pendingRequests = isOwner
    ? room.joinRequests.map((request) => ({ id: request.id, message: request.message, requester: request.user }))
    : [];
  const problem = getPairingProblem(room.Roomtags.find((tag) => tag.startsWith("problem:"))?.replace("problem:", ""));
  const visibleTags = room.Roomtags.filter((tag) => !tag.startsWith("problem:"));

  async function handleDeleteRoom() {
    "use server";
    await deleteRoom(roomid);
    revalidatePath("/");
    redirect("/");
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-[#9ccfd8]">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9ccfd8] opacity-50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#9ccfd8]" /></span>
            {room.status.toLowerCase()} pairing room
          </div>
          <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">{room.name}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{room.description}</p>
        </div>
        <Badge variant="secondary" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">{room.Language}</Badge>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
        <section className="premium-keyline overflow-hidden rounded-[26px] border border-border/80 bg-card shadow-[0_28px_80px_rgba(10,8,18,.32)]">
          {canEnterCall ? (
            <ClientVideoPlayer room={room} />
          ) : (
            <div className="relative grid min-h-[620px] place-items-center overflow-hidden bg-[#191724] p-6 sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(196,167,231,.12),transparent_42%)]" />
              <div className="relative max-w-md text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] border border-primary/20 bg-primary/10 text-primary shadow-[0_14px_36px_rgba(235,111,146,.12)]"><LockKeyhole className="h-7 w-7" /></div>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[.2em] text-[#ebbcba]">Pairing access</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-foreground">Meet after you match.</h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">The call opens after the room owner accepts your request. It keeps every session small, intentional, and focused on the brief.</p>
                <div className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground"><Radio className="h-3.5 w-3.5 text-[#9ccfd8]" /> Video room waiting</div>
              </div>
            </div>
          )}
        </section>
        {problem && <ProblemWorkbench problem={problem} roomId={room.id} />}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[88px] xl:self-start">
          <Card className="premium-panel premium-keyline rounded-[22px]">
            <CardContent className="space-y-6 p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#908caa]">Focus areas</p>
                <div className="mt-3 flex flex-wrap gap-2">{visibleTags.map((tag) => <Badge key={tag} className="gap-1 rounded-full border border-[#c4a7e7]/15 bg-[#c4a7e7]/[0.08] text-[#c4a7e7] hover:bg-[#c4a7e7]/10"><Tags className="h-3 w-3" />{tag}</Badge>)}</div>
              </div>
              <div className="h-px bg-border/80" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#908caa]">Pairing capacity</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-foreground"><Users className="h-4 w-4 text-[#9ccfd8]" /> {room.participants.length} of {room.maxParticipants} places confirmed</p>
              </div>
              {room.GithubRepo && (
                <><div className="h-px bg-border/80" /><div><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#908caa]">Repository</p><a href={room.GithubRepo} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 break-all text-sm text-[#9ccfd8] transition hover:text-foreground"><Github className="h-4 w-4 shrink-0" /> {room.GithubRepo.replace(/^https?:\/\//, "")} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a></div></>
              )}
            </CardContent>
          </Card>

          {!viewerId ? (
            <Card className="premium-panel rounded-[22px]"><CardContent className="p-5"><p className="font-semibold text-foreground">Want to help?</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in, then send the owner a focused request.</p><Button asChild className="mt-4 w-full rounded-xl"><Link href={`/sign-in?redirect_url=/rooms/${room.id}`} prefetch={false}>Sign in to request access</Link></Button></CardContent></Card>
          ) : !canEnterCall ? (
            <RoomRequestControls roomId={room.id} requestStatus={ownRequest?.status ?? null} />
          ) : null}

          {isOwner && (
            <>
              <RoomRequestControls roomId={room.id} requestStatus={null} pendingRequests={pendingRequests} showRequestForm={false} />
              <form action={handleDeleteRoom}><Button type="submit" variant="ghost" className="w-full justify-start rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete room</Button></form>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
