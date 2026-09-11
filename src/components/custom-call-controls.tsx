"use client";

import {
  DeviceSettings,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  Loader2,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Smile,
  Video,
  VideoOff,
} from "lucide-react";
import { useEffect, useState } from "react";

type CustomCallControlsProps = {
  onLeave?: () => void | Promise<void>;
};

// The installed Stream participant UI maps these exact emoji codes. Keeping the
// wire values aligned with that map makes reactions visible on every tile.
const reactions = [
  { type: "reaction", emoji_code: ":like:", icon: "👍", label: "Like" },
  { type: "reaction", emoji_code: ":heart:", icon: "❤️", label: "Love" },
  { type: "reaction", emoji_code: ":smile:", icon: "😀", label: "Smile" },
  { type: "reaction", emoji_code: ":fireworks:", icon: "🎉", label: "Celebrate" },
  { type: "reaction", emoji_code: ":dislike:", icon: "👎", label: "Dislike" },
  { type: "raised-hand", emoji_code: ":raise-hand:", icon: "✋", label: "Raise hand" },
] as const;

export function CustomCallControls({ onLeave }: CustomCallControlsProps) {
  const call = useCall();
  const {
    useMicrophoneState,
    useCameraState,
    useScreenShareState,
    useHasOngoingScreenShare,
  } = useCallStateHooks();

  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  const { camera, isMute: isCameraMuted } = useCameraState();
  const { screenShare, status: screenShareStatus } = useScreenShareState();
  const hasOngoingScreenShare = useHasOngoingScreenShare();
  const isScreenSharing = screenShareStatus === "enabled";

  const [micLoading, setMicLoading] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [reactionFeedback, setReactionFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!reactionFeedback) return;
    const timeout = window.setTimeout(() => setReactionFeedback(null), 1800);
    return () => window.clearTimeout(timeout);
  }, [reactionFeedback]);

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

  const sendReaction = async (reaction: (typeof reactions)[number]) => {
    if (!call) return;
    try {
      await call.sendReaction({
        type: reaction.type,
        emoji_code: reaction.emoji_code,
        custom: { clearAfterTimeout: true },
      });
      setReactionFeedback(`${reaction.icon} ${reaction.label} sent`);
      setReactionsOpen(false);
    } catch (error) {
      setReactionFeedback("Reaction could not be sent");
      console.error("Could not send reaction:", error);
    }
  };

  const leaveCall = async () => {
    if (leaving) return;
    try {
      setLeaving(true);
      if (onLeave) await onLeave();
      else await call?.leave();
    } catch (error) {
      console.error("Could not leave call:", error);
    } finally {
      setLeaving(false);
    }
  };

  const someoneElseIsSharing = hasOngoingScreenShare && !isScreenSharing;

  return (
    <div className="relative">
      {reactionFeedback && (
        <div
          role="status"
          className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#403d52] bg-[#26233a]/95 px-3 py-1.5 text-xs font-medium text-[#e0def4] shadow-xl"
        >
          {reactionFeedback}
        </div>
      )}

      <div
        data-ui="call-controls"
        className="flex max-w-[calc(100vw-2rem)] items-center gap-1.5 overflow-visible rounded-[18px] border border-[#403d52]/90 bg-[#1f1d2e]/95 p-1.5 shadow-[0_22px_60px_rgba(10,8,18,.5)] backdrop-blur-2xl sm:gap-2 sm:p-2"
      >
        <ControlButton
          active={!isMicMuted}
          danger={isMicMuted}
          label={isMicMuted ? "Unmute microphone" : "Mute microphone"}
          onClick={toggleMic}
          loading={micLoading}
        >
          {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </ControlButton>

        <ControlButton
          active={!isCameraMuted}
          danger={isCameraMuted}
          label={isCameraMuted ? "Turn camera on" : "Turn camera off"}
          onClick={toggleCamera}
          loading={cameraLoading}
        >
          {isCameraMuted ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </ControlButton>

        <div className="mx-0.5 h-7 w-px bg-[#403d52]" />

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

        <div className="relative">
          <ControlButton
            label="Reactions"
            active={reactionsOpen}
            onClick={() => setReactionsOpen((value) => !value)}
          >
            <Smile className="h-5 w-5" />
          </ControlButton>

          {reactionsOpen && (
            <div className="absolute bottom-14 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-[#403d52] bg-[#26233a]/95 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="flex gap-1">
                {reactions.map((reaction) => (
                  <button
                    key={`${reaction.type}-${reaction.emoji_code}`}
                    type="button"
                    onClick={() => sendReaction(reaction)}
                    className="grid h-10 w-10 place-items-center rounded-xl text-xl transition hover:-translate-y-0.5 hover:bg-[#c4a7e7]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb6f92]"
                    aria-label={reaction.label}
                    title={reaction.label}
                  >
                    {reaction.icon}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pairme-device-settings [&_.str-video__call-controls__button]:!h-11 [&_.str-video__call-controls__button]:!w-11">
          <DeviceSettings />
        </div>

        <div className="mx-0.5 h-7 w-px bg-[#403d52]" />

        <button
          type="button"
          onClick={leaveCall}
          disabled={leaving}
          aria-label="Leave call"
          title="Leave call"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#eb6f92] text-[#191724] shadow-[0_10px_28px_rgba(235,111,146,.25)] transition hover:-translate-y-0.5 hover:bg-[#f083a2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ebbcba] disabled:pointer-events-none disabled:opacity-50"
        >
          {leaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <PhoneOff className="h-5 w-5" />}
        </button>
      </div>
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
      className={`group relative grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb6f92] disabled:pointer-events-none disabled:opacity-35 ${
        danger
          ? "border-[#eb6f92]/35 bg-[#eb6f92]/12 text-[#eb6f92] hover:bg-[#eb6f92]/18"
          : active
            ? "border-[#9ccfd8]/35 bg-[#31748f]/25 text-[#9ccfd8] hover:bg-[#31748f]/35"
            : "border-[#403d52] bg-[#26233a] text-[#e0def4] hover:-translate-y-0.5 hover:border-[#c4a7e7]/55 hover:bg-[#302c48]"
      }`}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : children}
      <span className="pointer-events-none absolute -top-11 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#403d52] bg-[#26233a] px-2.5 py-1.5 text-[11px] font-medium text-[#e0def4] opacity-0 shadow-xl transition group-hover:opacity-100 group-focus-visible:opacity-100">
        {label}
      </span>
    </button>
  );
}
