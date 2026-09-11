"use client";

import {
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  PhoneOff,
  MoreHorizontal,
  Loader2,
  Copy,
  Settings,
  Smile,
} from "lucide-react";
import { useState } from "react";

type CustomCallControlsProps = {
  onLeave?: () => void | Promise<void>;
};

const reactions = [
  {
    type: "like",
    emoji_code: ":like:",
    icon: "👍",
  },
  {
    type: "love",
    emoji_code: ":heart:",
    icon: "❤️",
  },
  {
    type: "laugh",
    emoji_code: ":joy:",
    icon: "😂",
  },
  {
    type: "fire",
    emoji_code: ":fire:",
    icon: "🔥",
  },
  {
    type: "celebrate",
    emoji_code: ":tada:",
    icon: "🎉",
  },
  {
    type: "raised-hand",
    emoji_code: ":raised-hand:",
    icon: "✋",
  },
];

export function CustomCallControls({
  onLeave,
}: CustomCallControlsProps) {
  const call = useCall();

  const {
    useMicrophoneState,
    useCameraState,
    useScreenShareState,
    useHasOngoingScreenShare,
  } = useCallStateHooks();

  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  const { camera, isMute: isCameraMuted } = useCameraState();

  const {
    screenShare,
    status: screenShareStatus,
  } = useScreenShareState();

  const hasOngoingScreenShare =
    useHasOngoingScreenShare();

  const isScreenSharing =
    screenShareStatus === "enabled";

  const [micLoading, setMicLoading] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);

  const toggleMic = async () => {
    if (micLoading) return;

    try {
      setMicLoading(true);
      await microphone.toggle();
    } catch (error) {
      console.error("Could not toggle microphone:", error);
    } finally {
      setMicLoading(false);
    }
  };

  const toggleCamera = async () => {
    if (cameraLoading) return;

    try {
      setCameraLoading(true);
      await camera.toggle();
    } catch (error) {
      console.error("Could not toggle camera:", error);
    } finally {
      setCameraLoading(false);
    }
  };

  const toggleScreenShare = async () => {
    if (screenLoading) return;

    try {
      setScreenLoading(true);
      await screenShare.toggle();
    } catch (error) {
      console.error("Could not toggle screen share:", error);
    } finally {
      setScreenLoading(false);
    }
  };

  const sendReaction = async (
    type: string,
    emoji_code: string,
  ) => {
    if (!call) return;

    try {
      await call.sendReaction({
        type,
        emoji_code,
        custom: {
          clearAfterTimeout: true,
        },
      });

      setReactionsOpen(false);
    } catch (error) {
      console.error("Could not send reaction:", error);
    }
  };

  const copyCallId = async () => {
    if (!call?.id) return;

    await navigator.clipboard.writeText(call.id);
    setMoreOpen(false);
  };

  const leaveCall = async () => {
    if (leaving) return;

    try {
      setLeaving(true);

      if (onLeave) {
        await onLeave();
        return;
      }

      await call?.leave();
    } catch (error) {
      console.error("Could not leave call:", error);
    } finally {
      setLeaving(false);
    }
  };

  const someoneElseIsSharing =
    hasOngoingScreenShare && !isScreenSharing;

  return (
    <div className="relative flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#111116]/90 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      {/* Mic */}
      <ControlButton
        active={!isMicMuted}
        danger={isMicMuted}
        label={isMicMuted ? "Unmute" : "Mute"}
        onClick={toggleMic}
        loading={micLoading}
      >
        {isMicMuted ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </ControlButton>

      {/* Camera */}
      <ControlButton
        active={!isCameraMuted}
        danger={isCameraMuted}
        label={
          isCameraMuted
            ? "Turn camera on"
            : "Turn camera off"
        }
        onClick={toggleCamera}
        loading={cameraLoading}
      >
        {isCameraMuted ? (
          <VideoOff className="h-5 w-5" />
        ) : (
          <Video className="h-5 w-5" />
        )}
      </ControlButton>

      <div className="mx-1 h-7 w-px bg-white/[0.08]" />

      {/* Screen share */}
      <ControlButton
        active={isScreenSharing}
        label={
          someoneElseIsSharing
            ? "Someone is already sharing"
            : isScreenSharing
              ? "Stop sharing"
              : "Share screen"
        }
        onClick={toggleScreenShare}
        loading={screenLoading}
        disabled={someoneElseIsSharing}
      >
        <MonitorUp className="h-5 w-5" />
      </ControlButton>

      {/* Reactions */}
      <div className="relative">
        <ControlButton
          label="Reactions"
          active={reactionsOpen}
          onClick={() => {
            setReactionsOpen((value) => !value);
            setMoreOpen(false);
          }}
        >
          <Smile className="h-5 w-5" />
        </ControlButton>

        {reactionsOpen && (
          <div className="absolute bottom-14 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-white/[0.08] bg-[#15151b]/95 p-2 shadow-2xl backdrop-blur-2xl">
            <div className="flex gap-1">
              {reactions.map((reaction) => (
                <button
                  key={reaction.type}
                  type="button"
                  onClick={() =>
                    sendReaction(
                      reaction.type,
                      reaction.emoji_code,
                    )
                  }
                  className="grid h-11 w-11 place-items-center rounded-xl text-xl transition hover:-translate-y-0.5 hover:bg-white/[0.08] active:translate-y-0"
                  title={reaction.type}
                >
                  {reaction.icon}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* More */}
      <div className="relative">
        <ControlButton
          label="More"
          active={moreOpen}
          onClick={() => {
            setMoreOpen((value) => !value);
            setReactionsOpen(false);
          }}
        >
          <MoreHorizontal className="h-5 w-5" />
        </ControlButton>

        {moreOpen && (
          <div className="absolute bottom-14 right-0 z-50 w-52 rounded-2xl border border-white/[0.08] bg-[#15151b]/95 p-1.5 shadow-2xl backdrop-blur-2xl">
            <button
              type="button"
              onClick={copyCallId}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Copy className="h-4 w-4" />
              Copy call ID
            </button>

            <button
              type="button"
              onClick={() => {
                console.log("Device settings clicked");
                setMoreOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Settings className="h-4 w-4" />
              Device settings
            </button>
          </div>
        )}
      </div>

      <div className="mx-1 h-7 w-px bg-white/[0.08]" />

      {/* Leave */}
      <button
        type="button"
        onClick={leaveCall}
        disabled={leaving}
        title="Leave call"
        className="grid h-11 w-11 place-items-center rounded-xl bg-red-500 text-white shadow-[0_8px_30px_rgba(239,68,68,0.25)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-red-400 hover:shadow-[0_12px_35px_rgba(239,68,68,0.35)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-50"
      >
        {leaving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <PhoneOff className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

type ControlButtonProps = {
  children: React.ReactNode;
  label: string;
  onClick: () => void | Promise<void>;
  active?: boolean;
  danger?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

function ControlButton({
  children,
  label,
  onClick,
  active = false,
  danger = false,
  loading = false,
  disabled = false,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        group relative grid h-11 w-11 place-items-center
        rounded-xl border transition-all duration-150

        ${
          danger
            ? "border-red-400/15 bg-red-500/10 text-red-300 hover:bg-red-500/15"
            : active
              ? "border-white/[0.1] bg-white/[0.10] text-white hover:bg-white/[0.14]"
              : "border-white/[0.07] bg-white/[0.045] text-zinc-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.09] hover:text-white"
        }

        disabled:pointer-events-none
        disabled:opacity-30
      `}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        children
      )}

      <span className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#18181f] px-2.5 py-1.5 text-[11px] font-medium text-zinc-200 opacity-0 shadow-xl transition group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}