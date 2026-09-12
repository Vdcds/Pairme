import { prisma, withDatabaseRetry } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { unstable_noStore } from "next/cache";
export async function getRooms(searchQuery?: string) {
  unstable_noStore();
  const rooms = await withDatabaseRetry(() => prisma.room.findMany({
    where: searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
            { Language: { contains: searchQuery, mode: "insensitive" } },
            { Roomtags: { hasSome: [searchQuery] } },
          ],
        }
      : undefined,
  }));
  return rooms;
}

export async function getRoom(roomId: string) {
  unstable_noStore();

  const room = await withDatabaseRetry(() => prisma.room.findUnique({
    where: { id: roomId },
    include: {
      participants: { select: { userId: true, role: true } },
      joinRequests: {
        where: { status: "PENDING" },
        include: { user: { select: { name: true, email: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  }));

  return room;
}
export async function deleteRoom(roomId: string) {
  unstable_noStore();

  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Sign in to delete a room.");
    const room = await prisma.room.findUnique({ where: { id: roomId }, select: { userId: true } });
    if (!room || room.userId !== user.id) throw new Error("Only the room owner can delete this room.");

    const deletedRoom = await prisma.room.delete({
      where: {
        id: roomId,
      },
    });

    return deletedRoom;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw new Error("Failed to delete room");
  }
}
