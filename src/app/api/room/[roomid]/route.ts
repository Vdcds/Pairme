import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Extract room data from the request
    const { roomId, roomData } = await req.json();
    console.log("Room ID:", roomId);
    console.log("Room Data:", roomData);

    // Validate if room ID and room data are provided
    if (!roomId || !roomData) {
      return NextResponse.json(
        { error: "Missing roomId or roomData" },
        { status: 400 }
      );
    }

    // Find the room by ID
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
      include: { user: true },
    });
    console.log("Existing Room:", existingRoom);

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Verify that the authenticated user is the owner of the room
    if (existingRoom.user.email !== session.user.email) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Update the room with the provided data
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: roomData,
    });
    console.log("Updated Room:", updatedRoom);

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 }
    );
  }
}
