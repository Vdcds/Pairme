import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const { roomData, user } = body;

    if (!user || !user.email) {
      console.error("User or user email is missing from the request");
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    // Verify the field name `RoomDescription` matches the schema
    console.log("Creating room with data:", {
      ...roomData,
      userEmail: user.email,
    });

    const newRoom = await prisma.room.create({
      data: {
        name: roomData.name,
        Language: roomData.Language,
        GithubRepo: roomData.GithubRepo,
        RoomDescription: roomData.RoomDescription,
        RoomTags: roomData.RoomTags, // Ensure this matches the schema
        user: {
          connect: {
            email: user.email, // Ensure email is unique in the User model
          },
        },
      },
    });

    console.log("Room created successfully:", newRoom);
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
