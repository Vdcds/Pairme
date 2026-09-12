import { NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma, withDatabaseRetry } from "@/lib/prisma";

export const runtime = "nodejs";

const tokenSchema = z.object({ roomId: z.string().cuid() });

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in before joining a call." },
      { status: 401 },
    );
  }

  const tokenRequest = tokenSchema.safeParse({ roomId: new URL(request.url).searchParams.get("roomId") });
  if (!tokenRequest.success) return NextResponse.json({ error: "A valid room is required." }, { status: 400 });

  const hasAccess = await withDatabaseRetry(() => prisma.room.findFirst({
    where: {
      id: tokenRequest.data.roomId,
      OR: [{ userId: user.id }, { participants: { some: { userId: user.id } } }],
    },
    select: { id: true },
  }));
  if (!hasAccess) return NextResponse.json({ error: "You need an accepted request to enter this room." }, { status: 403 });

  const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY;
  const apiSecret = process.env.GET_STREAM_SECRET_KEY;

  if (!apiKey || !apiSecret) {
    console.error("Missing Stream credentials", {
      apiKeyPresent: Boolean(apiKey),
      apiSecretPresent: Boolean(apiSecret),
    });

    return NextResponse.json(
      { error: "Video calling is not configured on this environment yet." },
      { status: 503 },
    );
  }

  const userId = user.clerkId;

  try {
    const client = new StreamClient(apiKey, apiSecret);

    await client.upsertUsers([
      {
        id: userId,
        name: user.name ?? "Pairme member",
        image: user.image ?? undefined,
      },
    ]);

    const token = client.generateUserToken({
      user_id: userId,
    });

    return NextResponse.json({
      apiKey,
      token,
    });
  } catch (error) {
    console.error("Unable to create Stream Video token", error);

    return NextResponse.json(
      {
        error: "Could not prepare your video session. Please try again.",
      },
      { status: 502 },
    );
  }
}
