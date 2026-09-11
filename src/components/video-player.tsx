"use client";

import { Room } from "@prisma/client";
import {
  Call,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Camera,
  ChevronLeft,
  Loader2,
  LockKeyhole,
  Mic,
  Sparkles,
  TriangleAlert,
  Users,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CustomCallControls } from "@/components/custom-call-controls";

const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY;

type CallStatus = "lobby" | "joining" | "joined" | "error";

type TokenResponse = {
  apiKey?: string;
  token?: string;
  error?: string;
};

export function ClientVideoPlayer({ room }: { room: Room }) {
  const { data: session, status: sessionStatus } = useSession();

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  const [status, setStatus] = useState<CallStatus>("lobby");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const userId = session?.user?.id;

    if (!apiKey || !userId) return;

    let disposed = false;

    const tokenProvider = async (): Promise<string> => {
      const response = await fetch("/api/token", {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json()) as TokenResponse;

      if (!response.ok) {
        throw new Error(
          payload.error ??
            `Could not refresh video session (${response.status}).`,
        );
      }

      if (!payload.token || typeof payload.token !== "string") {
        console.error("Invalid token response:", payload);

        throw new Error(
          "The server returned an invalid Stream authentication token.",
        );
      }

      return payload.token;
    };

    const videoClient = new StreamVideoClient({
      apiKey,
      user: {
        id: String(userId),
        name: session.user.name ?? "PairMe member",
        image: session.user.image ?? undefined,
      },
      tokenProvider,
    });

    if (!disposed) {
      setClient(videoClient);
    }

    return () => {
      disposed = true;

      setClient(null);
      setCall(null);

      videoClient.disconnectUser().catch((disconnectError) => {
        console.error("Failed to disconnect Stream user:", disconnectError);
      });
    };
  }, [session?.user?.id, session?.user?.name, session?.user?.image]);

  const joinCall = async () => {
    if (!apiKey) {
      setError(
        "Video isn't configured. Add the Stream API key and restart the app.",
      );
      setStatus("error");
      return;
    }

    if (!session?.user?.id) {
      setError("You need to sign in before joining this room.");
      setStatus("error");
      return;
    }

    if (!client) {
      setError("Your video session is still being prepared.");
      setStatus("error");
      return;
    }

    setStatus("joining");
    setError(null);

    let roomCall: Call | undefined;

    try {
      roomCall = client.call("default", room.id);

      await roomCall.join({
        create: true,
      });

      setCall(roomCall);
      setStatus("joined");

      const unavailableDevices: string[] = [];

      try {
        await roomCall.camera.enable();
      } catch (cameraError) {
        console.warn("Camera unavailable:", cameraError);
        unavailableDevices.push("camera");
      }

      try {
        await roomCall.microphone.enable();
      } catch (microphoneError) {
        console.warn("Microphone unavailable:", microphoneError);
        unavailableDevices.push("microphone");
      }

      if (unavailableDevices.length) {
        setError(
          `You're connected, but ${unavailableDevices.join(
            " and ",
          )} access wasn't granted. You can retry from the controls below.`,
        );
      }
    } catch (cause) {
      await roomCall?.leave().catch(() => undefined);

      console.error("Failed to join Stream call:", cause);

      setError(
        cause instanceof Error ? cause.message : "Couldn't join the room.",
      );

      setStatus("error");
    }
  };

  const leaveCall = async () => {
    try {
      await call?.leave();
    } catch (cause) {
      console.error("Failed to leave call:", cause);
    }

    setCall(null);
    setStatus("lobby");

    router.push("/");
  };

  if (status !== "joined" || !client || !call) {
    return (
      <main className="relative min-h-[620px] overflow-hidden bg-[#07070a] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-180px] h-[430px] w-[650px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />

          <div className="absolute bottom-[-250px] right-[-100px] h-[500px] w-[500px] rounded-full bg-fuchsia-700/10 blur-[140px]" />

          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, rgba(255,255,255,.16) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "linear-gradient(to bottom, black, transparent 85%)",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-400 backdrop-blur-xl">
            <LockKeyhole className="h-3.5 w-3.5 text-emerald-400" />
            Secure room
          </div>
        </div>

        <div className="relative z-10 mx-auto grid min-h-[550px] max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
          <section>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/[0.08] px-3 py-1.5 text-xs font-medium text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              PairMe Live
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Jump into
              <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-400 bg-clip-text text-transparent">
                {room.name}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
              Real-time collaboration without the corporate meeting-room
              nonsense. Camera, mic, people, pairing. Done.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 text-sm text-zinc-300 backdrop-blur-xl">
                <Video className="h-4 w-4 text-violet-300" />
                HD video
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 text-sm text-zinc-300 backdrop-blur-xl">
                <Mic className="h-4 w-4 text-violet-300" />
                Crystal audio
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 text-sm text-zinc-300 backdrop-blur-xl">
                <Users className="h-4 w-4 text-violet-300" />
                Built for pairing
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="absolute -inset-px rounded-[30px] bg-gradient-to-b from-violet-500/30 via-white/[0.06] to-transparent" />

            <div className="relative overflow-hidden rounded-[29px] border border-white/[0.06] bg-[#0d0d12]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-2xl">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[23px] bg-[#111118]">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.08] via-transparent to-fuchsia-500/[0.07]" />

                <div
                  className="absolute inset-0 opacity-[0.1]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,.3) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-xl">
                  <Video className="h-8 w-8 text-violet-300" />
                </div>

                <div className="absolute bottom-4 left-4 rounded-full border border-white/[0.08] bg-black/40 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur-xl">
                  {session?.user?.name ?? "You"}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Joining
                  </p>

                  <h2 className="mt-1 truncate text-xl font-semibold tracking-tight">
                    {room.name}
                  </h2>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/10 text-violet-300">
                      <Camera className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">Camera</p>
                      <p className="text-xs text-zinc-500">Starts on</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/10 text-violet-300">
                      <Mic className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">Microphone</p>
                      <p className="text-xs text-zinc-500">Starts on</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 flex gap-3 rounded-2xl border border-red-400/15 bg-red-500/[0.08] p-4 text-sm text-red-200">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  onClick={joinCall}
                  disabled={
                    status === "joining" ||
                    sessionStatus === "loading" ||
                    !client
                  }
                  className="mt-5 h-12 w-full rounded-2xl bg-white font-semibold text-black shadow-[0_12px_40px_rgba(139,92,246,.18)] transition hover:bg-zinc-100"
                >
                  {status === "joining" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining room...
                    </>
                  ) : client ? (
                    <>
                      <Video className="mr-2 h-4 w-4" />
                      Join room
                    </>
                  ) : (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing call...
                    </>
                  )}
                </Button>

                <p className="mt-3 text-center text-[11px] leading-5 text-zinc-600">
                  Camera and microphone permissions stay under your browser's
                  control.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <div className="relative min-h-[650px] overflow-hidden bg-[#07070a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,.09),transparent_38%)]" />

      <StreamVideo client={client}>
        <StreamTheme
          as="main"
          className="pairme-call relative z-10 flex min-h-[650px] flex-col"
        >
          <StreamCall call={call}>
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-black/20 px-5 backdrop-blur-xl sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <Video className="h-4 w-4" />

                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#07070a] bg-emerald-400" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-medium text-white">
                    {room.name}
                  </h2>

                  <p className="text-xs text-zinc-500">Live session</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-xs text-zinc-400">
                <LockKeyhole className="h-3.5 w-3.5 text-emerald-400" />
                Encrypted session
              </div>
            </header>

            <div className="relative flex-1 overflow-hidden p-3 sm:p-4">
              <SpeakerLayout participantsBarPosition="bottom" />

              {error && (
                <div className="absolute left-1/2 top-6 z-50 flex max-w-lg -translate-x-1/2 items-center gap-2 rounded-full border border-amber-300/20 bg-[#17120b]/90 px-4 py-2 text-xs text-amber-100 shadow-xl backdrop-blur-xl">
                  <TriangleAlert className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  {error}
                </div>
              )}
            </div>

            <footer className="shrink-0 border-t border-white/[0.06] bg-[#09090d]/80 px-4 py-4 backdrop-blur-2xl">
              <div className="flex justify-center">
                <CustomCallControls onLeave={leaveCall} />
              </div>
            </footer>
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    </div>
  );
}
