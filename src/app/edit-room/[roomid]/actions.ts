"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, Room } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

export async function editRoomAction(
  roomId: string,
  roomData: Partial<Omit<Room, "id" | "userId">>
): Promise<Prisma.RoomGetPayload<{}> | null> {
  // Get the current session
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Find the room
  const existingRoom = await prisma.room.findUnique({
    where: { id: roomId },
    include: { user: true },
  });

  if (!existingRoom) {
    throw new Error("Room not found");
  }

  // Check if the current user is the creator of the room
  if (existingRoom.user.id !== user.id) {
    throw new Error("You do not have permission to edit this room");
  }

  // Update the room
  const updatedRoom = await prisma.room.update({
    where: { id: roomId },
    data: roomData,
  });

  return updatedRoom;
}
