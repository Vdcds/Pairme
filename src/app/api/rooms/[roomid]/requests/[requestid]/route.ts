import { NextRequest, NextResponse } from "next/server";
import { Prisma, RoomJoinRequestStatus, RoomParticipantRole, RoomStatus } from "@prisma/client";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma, withDatabaseRetry } from "@/lib/prisma";

const decisionSchema = z.object({ action: z.enum(["accept", "decline"]) });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ roomid: string; requestid: string }> }) {
  const { roomid, requestid } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to manage requests." }, { status: 401 });
  const payload = decisionSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Choose accept or decline." }, { status: 400 });

  try {
    const result = await withDatabaseRetry(() => prisma.$transaction(async (tx) => {
      const joinRequest = await tx.roomJoinRequest.findUnique({
        where: { id: requestid },
        include: { room: { select: { userId: true, maxParticipants: true, _count: { select: { participants: true } } } } },
      });
      if (!joinRequest || joinRequest.roomId !== roomid) throw new RequestError("Join request not found.", 404);
      if (joinRequest.room.userId !== user.id) throw new RequestError("Only the room owner can decide this request.", 403);
      if (joinRequest.status !== RoomJoinRequestStatus.PENDING) throw new RequestError("This request has already been decided.", 409);

      if (payload.data.action === "decline") {
        return tx.roomJoinRequest.update({ where: { id: joinRequest.id }, data: { status: RoomJoinRequestStatus.DECLINED } });
      }
      if (joinRequest.room._count.participants >= joinRequest.room.maxParticipants) throw new RequestError("This room is already full.", 409);

      await tx.roomParticipant.create({ data: { roomId: roomid, userId: joinRequest.userId, role: RoomParticipantRole.MEMBER } });
      await tx.room.update({ where: { id: roomid }, data: { status: RoomStatus.MATCHED } });
      return tx.roomJoinRequest.update({ where: { id: joinRequest.id }, data: { status: RoomJoinRequestStatus.ACCEPTED } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }));

    return NextResponse.json({ request: result });
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status });
    if ((error as { code?: string }).code === "P2034") return NextResponse.json({ error: "Another decision was made at the same time. Refresh and try again." }, { status: 409 });
    console.error("Unable to decide room request", error);
    return NextResponse.json({ error: "Could not update this request." }, { status: 500 });
  }
}

class RequestError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}
