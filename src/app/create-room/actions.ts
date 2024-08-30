import { prisma } from "@/lib/prisma";
import { Prisma, Room, User } from "@prisma/client";

export async function createRoomAction(
  roomData: Omit<Room, "id" | "userId">,
  user: User
): Promise<Prisma.RoomGetPayload<{}>> {
  const newRoom = await prisma.room.create({
    data: {
      ...roomData,
      user: {
        connect: {
          id: user.id, // Use the `id` from the `User` object
        },
      },
    },
  });

  return newRoom;
}
