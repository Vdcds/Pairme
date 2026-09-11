import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditRoomForm from "./edit-user-form";

export default async function EditRoomPage({ params }: { params: { roomid: string } }) {
  const room = await prisma.room.findUnique({ where: { id: params.roomid } });

  if (!room) {
    return <main className="grid min-h-[70vh] place-items-center p-6"><p className="text-muted-foreground">Room not found.</p></main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <Link href={`/rooms/${room.id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to room</Link>
      <Card className="premium-panel premium-keyline overflow-hidden rounded-[28px]">
        <CardHeader className="border-b border-border/80 px-6 py-7 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#ebbcba]">Room settings</p>
          <CardTitle className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-foreground">Refine the pairing brief.</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-7 sm:px-8"><EditRoomForm room={room} /></CardContent>
      </Card>
    </main>
  );
}
