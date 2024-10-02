import { prisma } from "@/lib/prisma";
import { unstable_noStore } from "next/cache";
export async function getRooms(searchQuery?: string) {
  unstable_noStore();
  const rooms = await prisma.room.findMany({
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
  });
  return rooms;
}

export async function getRoom(roomId: string) {
  unstable_noStore();

  const room = await prisma.room.findFirst({
    where: {
      id: roomId, // This is the correct syntax to query by `id`
    },
  });

  return room;
}
export async function deleteRoom(roomId: string) {
  unstable_noStore();

  try {
    // Delete the room from the database
    const deletedRoom = await prisma.room.delete({
      where: {
        id: roomId,
      },
    });

    // You might want to perform additional cleanup here,
    // such as deleting associated records in other tables

    return deletedRoom;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw new Error("Failed to delete room");
  }
}
