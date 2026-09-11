import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const roomSchema = z.object({
  name: z.string().min(2).max(50),
  language: z.string().min(1),
  githubRepo: z.string().url().or(z.literal("")),
  description: z.string().min(10).max(255),
  roomTags: z.array(z.string()).min(1),
  zenLevel: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in to create a room." }, { status: 401 });
    }

    const { roomData } = await request.json();
    const data = roomSchema.parse(roomData);

    const newRoom = await prisma.room.create({
      data: {
        name: data.name,
        Language: data.language,
        GithubRepo: data.githubRepo,
        description: data.description,
        Roomtags: data.roomTags,
        ZenLevel: data.zenLevel,
        user: { connect: { id: session.user.id } },
      },
    });

    console.log("Room created successfully:", newRoom);
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Please check the room details and try again." }, { status: 400 });
    }
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const allRooms = await prisma.room.findMany();
    return NextResponse.json({ rooms: allRooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
