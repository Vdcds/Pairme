import { NextRequest, NextResponse } from "next/server";
import { RoomJoinRequestStatus, RoomStatus } from "@prisma/client";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma, withDatabaseRetry } from "@/lib/prisma";

const requestSchema = z.object({ message: z.string().trim().max(280).optional().default("") });

export async function POST(request: NextRequest, { params }: { params: Promise<{ roomid: string }> }) {
  const { roomid } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to request access." }, { status: 401 });

  const payload = requestSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Keep your request under 280 characters." }, { status: 400 });

  const room = await withDatabaseRetry(() => prisma.room.findUnique({
    where: { id: roomid },
    select: { userId: true, status: true, maxParticipants: true, _count: { select: { participants: true } } },
  }));
  if (!room) return NextResponse.json({ error: "Room not found." }, { status: 404 });
  if (room.userId === user.id) return NextResponse.json({ error: "You already own this room." }, { status: 409 });
  if (room.status === RoomStatus.COMPLETED || room.status === RoomStatus.CANCELLED) return NextResponse.json({ error: "This room is no longer accepting requests." }, { status: 409 });
  if (room._count.participants >= room.maxParticipants) return NextResponse.json({ error: "This room is already full." }, { status: 409 });

  const member = await withDatabaseRetry(() => prisma.roomParticipant.findUnique({ where: { roomId_userId: { roomId: roomid, userId: user.id } } }));
  if (member) return NextResponse.json({ error: "You already have access to this room." }, { status: 409 });

  const joinRequest = await withDatabaseRetry(() => prisma.$transaction(async (tx) => {
    const created = await tx.roomJoinRequest.upsert({
      where: { roomId_userId: { roomId: roomid, userId: user.id } },
      update: { message: payload.data.message || null, status: RoomJoinRequestStatus.PENDING },
      create: { roomId: roomid, userId: user.id, message: payload.data.message || null },
    });
    if (room.status === RoomStatus.OPEN) await tx.room.update({ where: { id: roomid }, data: { status: RoomStatus.REQUESTED } });
    return created;
  }));

  return NextResponse.json({ request: joinRequest }, { status: 201 });
}
