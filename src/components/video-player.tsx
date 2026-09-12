"use client";

import { Room } from "@prisma/client";
import {
  Call,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  VideoPreview,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CameraOff,
  ChevronLeft,
  CircleCheck,
  Code2,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CustomCallControls } from "@/components/custom-call-controls";

const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY;

type CallStatus = "lobby" | "joining" | "joined" | "error";
type TokenResponse = { apiKey?: string; token?: string; error?: string };

function PreviewUnavailable({ noCamera = false }: { noCamera?: boolean }) {
  return (
    <div className="grid h-full min-h-[260px] place-items-center p-8 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#403d52] bg-[#1f1d2e] text-[#c4a7e7]">
          <CameraOff className="h-6 w-6" />
        </div>
        <p className="mt-4 text-sm font-medium text-[#e0def4]">
          {noCamera ? "No camera found" : "Camera is off"}
        </p>
        <p className="mt-1 text-xs text-[#908caa]">
          {noCamera ? "You can still join with audio." : "Turn it on when you are ready."}
        </p>
      </div>
    </div>
  );
}

function StartingPreview() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#26233a]">
      <Loader2 className="h-6 w-6 animate-spin text-[#eb6f92]" />
    </div>
  );
}

function CallLobby({
  room,
  name,
  status,
  error,
  clientReady,
  sessionLoading,
  onJoin,
  onBack,
}: {
  room: Room;
  name: string;
  status: CallStatus;
  error: string | null;
  clientReady: boolean;
  sessionLoading: boolean;
  onJoin: () => void;
  onBack: () => void;
}) {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const cameraState = useCameraState();
  const microphoneState = useMicrophoneState();
  const permissionsGranted =
    cameraState.hasBrowserPermission && microphoneState.hasBrowserPermission;

  return (
    <main className="relative min-h-[690px] overflow-hidden bg-[#191724] text-[#e0def4]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(235,111,146,.12),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(196,167,231,.1),transparent_34%)]" />

      <header className="relative z-10 flex h-[60px] items-center justify-between border-b border-[#403d52]/70 px-4 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[#908caa] transition hover:bg-[#26233a] hover:text-[#e0def4]"
        >
          <ChevronLeft className="h-4 w-4" /> Back to room
        </button>
        <div className="flex items-center gap-2 rounded-full border border-[#403d52] bg-[#1f1d2e]/85 px-3 py-1.5 text-xs text-[#9ccfd8]">
          <LockKeyhole className="h-3.5 w-3.5" /> Member-only call
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-7 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)] lg:items-center">
        <section className="premium-panel overflow-hidden rounded-[28px] p-2">
          <div className="relative aspect-video min-h-[280px] overflow-hidden rounded-[22px] border border-[#403d52]/80 bg-[#26233a]">
            <VideoPreview
              className="h-full"
              DisabledVideoPreview={() => <PreviewUnavailable />}
              NoCameraPreview={() => <PreviewUnavailable noCamera />}
              StartingCameraPreview={StartingPreview}
            />
            <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-[#191724]/75 px-3 py-1.5 text-xs font-medium backdrop-blur-xl">
              {name}
            </div>
            <div className="pairme-preview-controls absolute bottom-4 right-4 flex gap-2 rounded-2xl border border-[#403d52]/80 bg-[#191724]/80 p-1.5 backdrop-blur-xl">
              <ToggleAudioPreviewButton />
              <ToggleVideoPreviewButton />
            </div>
          </div>
        </section>

        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eb6f92]/25 bg-[#eb6f92]/10 px-3 py-1.5 text-xs font-semibold text-[#ebbcba]">
            <Sparkles className="h-3.5 w-3.5" /> Ready room
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#908caa]">
            Pairing session
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-[#e0def4] sm:text-4xl">
            {room.name}
          </h1>
          <p className="mt-4 text-sm leading-6 text-[#908caa]">
            Check your frame and audio, then join when you are ready to build together.
          </p>

          <div className="mt-6 grid gap-2.5">
            <div className="flex items-center gap-3 rounded-2xl border border-[#403d52]/75 bg-[#1f1d2e]/80 p-3.5">
              <CircleCheck className="h-4 w-4 text-[#9ccfd8]" />
              <div>
                <p className="text-sm font-medium">Camera and microphone</p>
                <p className="text-xs text-[#6e6a86]">
                  {permissionsGranted ? "Devices are ready." : "Allow access in your browser, or join muted."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#403d52]/75 bg-[#1f1d2e]/80 p-3.5">
              <Users className="h-4 w-4 text-[#c4a7e7]" />
              <div>
                <p className="text-sm font-medium">Focused collaboration</p>
                <p className="text-xs text-[#6e6a86]">Video, audio, screen share, and reactions.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex gap-3 rounded-2xl border border-[#f6c177]/25 bg-[#f6c177]/10 p-4 text-sm text-[#f6c177]">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            onClick={onJoin}
            disabled={status === "joining" || sessionLoading || !clientReady}
            className="rose-gradient mt-6 h-12 w-full rounded-2xl border-0 font-semibold text-[#191724] shadow-[0_14px_34px_rgba(235,111,146,.2)] hover:opacity-95"
          >
            {status === "joining" || !clientReady ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{status === "joining" ? "Joining room…" : "Preparing call…"}</>
            ) : (
              <>Join pairing room <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
          <p className="mt-3 text-center text-[11px] leading-5 text-[#6e6a86]">
            Your browser stays in control of camera and microphone permissions.
          </p>
        </section>
      </div>
    </main>
  );
}

export function ClientVideoPlayer({ room }: { room: Room }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [status, setStatus] = useState<CallStatus>("lobby");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = user?.id;
    if (!apiKey || !userId) return;

    let disposed = false;
    const tokenProvider = async (): Promise<string> => {
      const response = await fetch(`/api/token?roomId=${encodeURIComponent(room.id)}`, {
        method: "GET",
        cache: "no-store",
      });
      const payload = (await response.json()) as TokenResponse;
      if (!response.ok) throw new Error(payload.error ?? `Could not refresh video session (${response.status}).`);
      if (!payload.token || typeof payload.token !== "string") {
        throw new Error("The server returned an invalid Stream authentication token.");
      }
      return payload.token;
    };

    const videoClient = new StreamVideoClient({
      apiKey,
      user: {
        id: String(userId),
        name: user.fullName ?? user.username ?? "Pairme member",
        image: user.imageUrl ?? undefined,
      },
      tokenProvider,
    });
    const roomCall = videoClient.call("default", room.id);

    setClient(videoClient);
    setCall(roomCall);
    setStatus("lobby");

    const prepareDevices = async () => {
      const unavailable: string[] = [];
      try { await roomCall.camera.enable(); } catch { unavailable.push("camera"); }
      try { await roomCall.microphone.enable(); } catch { unavailable.push("microphone"); }
      if (!disposed && unavailable.length) {
        setError(`${unavailable.join(" and ")} permission is off. You can still join and retry from the call controls.`);
      }
    };
    void prepareDevices();

    return () => {
      disposed = true;
      setClient(null);
      setCall(null);
      void roomCall.leave().catch(() => undefined);
      void videoClient.disconnectUser().catch((disconnectError) => {
        console.error("Failed to disconnect Stream user:", disconnectError);
      });
    };
  }, [room.id, user?.id, user?.fullName, user?.username, user?.imageUrl]);

  const joinCall = async () => {
    if (!apiKey) {
      setError("Video is not configured. Add the Stream API key and restart the app.");
      setStatus("error");
      return;
    }
    if (!isSignedIn || !user?.id) {
      setError("You need to sign in before joining this room.");
      setStatus("error");
      return;
    }
    if (!client || !call) {
      setError("Your video session is still being prepared.");
      setStatus("error");
      return;
    }

    setStatus("joining");
    setError(null);
    try {
      await call.join({ create: true });
      setStatus("joined");

      const unavailableDevices: string[] = [];
      try { await call.camera.enable(); } catch { unavailableDevices.push("camera"); }
      try { await call.microphone.enable(); } catch { unavailableDevices.push("microphone"); }
      if (unavailableDevices.length) {
        setError(`You are connected, but ${unavailableDevices.join(" and ")} access is off. Retry from the controls below.`);
      }
    } catch (cause) {
      await call.leave().catch(() => undefined);
      console.error("Failed to join Stream call:", cause);
      setError(cause instanceof Error ? cause.message : "Could not join the room.");
      setStatus("error");
    }
  };

  const leaveCall = async () => {
    try { await call?.leave(); } catch (cause) { console.error("Failed to leave call:", cause); }
    setStatus("lobby");
    router.push("/");
  };

  if (!client || !call) {
    return (
      <div className="grid min-h-[620px] place-items-center bg-[#191724] text-[#908caa]">
        <div className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-[#eb6f92]" /><p className="mt-3 text-sm">Preparing your call…</p></div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme as="div" className="pairme-call min-h-[690px]">
        <StreamCall call={call}>
          {status !== "joined" ? (
            <CallLobby
              room={room}
              name={user?.fullName ?? user?.username ?? "You"}
              status={status}
              error={error}
              clientReady={Boolean(client)}
              sessionLoading={!isLoaded}
              onJoin={joinCall}
              onBack={() => router.back()}
            />
          ) : (
            <main className="flex min-h-[690px] flex-col bg-[#191724] text-[#e0def4]">
              <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#403d52]/70 bg-[#1f1d2e]/85 px-4 backdrop-blur-xl sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#403d52] bg-[#26233a] text-[#c4a7e7]">
                    <Code2 className="h-4 w-4" />
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#1f1d2e] bg-[#9ccfd8]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold">{room.name}</h2>
                    <p className="text-xs text-[#908caa]">Live pairing room</p>
                  </div>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-[#403d52] bg-[#26233a]/80 px-3 py-1.5 text-xs text-[#9ccfd8] sm:flex">
                  <ShieldCheck className="h-3.5 w-3.5" /> Secure session
                </div>
              </header>

              <div className="relative min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
                <SpeakerLayout participantsBarPosition="bottom" />
                {error && (
                  <div className="absolute left-1/2 top-6 z-50 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-[#f6c177]/25 bg-[#26233a]/95 px-4 py-2 text-xs text-[#f6c177] shadow-xl backdrop-blur-xl">
                    <TriangleAlert className="h-3.5 w-3.5 shrink-0" /> {error}
                  </div>
                )}
              </div>

              <footer className="shrink-0 border-t border-[#403d52]/70 bg-[#1f1d2e]/90 px-3 py-3 backdrop-blur-2xl sm:px-4 sm:py-4">
                <div className="flex justify-center"><CustomCallControls onLeave={leaveCall} /></div>
              </footer>
            </main>
          )}
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}
