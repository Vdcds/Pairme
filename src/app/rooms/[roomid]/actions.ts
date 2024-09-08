"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StreamChat } from "stream-chat";

export async function generateTokenAction() {
  try {
    console.log("Attempting to get server session...");
    const session = await getServerSession(authOptions);
    console.log("Session result:", session);

    if (!session || !session.user || !session.user.id) {
      console.error("Not authenticated");
      throw new Error("Not authenticated");
    }

    const api_key = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY;
    const api_secret = process.env.GET_STREAM_SECRET_KEY;

    if (!api_key || !api_secret) {
      console.error("Stream API key or secret is not defined");
      throw new Error("Stream API key or secret is not defined");
    }

    const serverClient = StreamChat.getInstance(api_key, api_secret);

    const userId = session.user.id.toString();
    console.log("Generating token for user ID:", userId);

    const token = serverClient.createToken(
      userId,
      Math.floor(Date.now() / 1000) + 3600
    );

    console.log("Generated token:", token);
    return token;
  } catch (error) {
    console.error("Error in generateTokenAction:", error);
    throw error;
  }
}
