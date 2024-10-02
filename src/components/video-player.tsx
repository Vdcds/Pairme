"use client";
import React from "react";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Room } from "@prisma/client";
import {
  Call,
  CallControls,
  CallParticipantsList,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { generateTokenAction } from "@/app/rooms/[roomid]/actions";
import { useRouter } from "next/navigation";

const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY!;

export function ClientVideoPlayer({ room }: { room: Room }) {
  const session = useSession();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!room) return;
    if (!session.data) {
      return;
    }
    const userId = session.data.user.id;
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: userId,
        name: session.data.user.name ?? undefined,
        image: session.data.user.image ?? undefined,
      },
      tokenProvider: () => generateTokenAction(),
    });
    const call = client.call("default", room.id);
    call.join({ create: true });
    setClient(client);
    setCall(call);
    return () => {
      call
        .leave()
        .then(() => client.disconnectUser())
        .catch(console.error);
    };
  }, [session, room]);

  return (
    <>
      {client && call && (
        <div className="custom-video-container mt-2">
          <StreamVideo client={client}>
            <StreamTheme as="main" className="pt-3  mt-2 ">
              <StreamCall call={call}>
                <SpeakerLayout />
                <CallControls
                  onLeave={() => {
                    router.push("/");
                  }}
                />
                <CallParticipantsList onClose={() => undefined} />
              </StreamCall>
            </StreamTheme>
          </StreamVideo>
        </div>
      )}
    </>
  );
}
