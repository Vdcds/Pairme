import { prisma } from "@/lib/prisma";
import { unstable_noStore } from "next/cache";
export async function getRooms() {
  unstable_noStore();
  const rooms = await prisma.room.findMany();
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
