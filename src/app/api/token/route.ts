import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { StreamClient } from "@stream-io/node-sdk";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id) {
    return NextResponse.json(
      { error: "Sign in before joining a call." },
      { status: 401 },
    );
  }

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

  const userId = String(user.id);

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
