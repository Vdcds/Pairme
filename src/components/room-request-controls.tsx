"use client";

import { FormEvent, useState } from "react";
import { Check, Loader2, Send, UserRoundCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type RequestStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "WITHDRAWN" | null;

type PendingRequest = {
  id: string;
  message: string | null;
  requester: { name: string | null; email: string; image: string | null };
};

type Props = {
  roomId: string;
  requestStatus: RequestStatus;
  pendingRequests?: PendingRequest[];
  showRequestForm?: boolean;
};

export function RoomRequestControls({ roomId, requestStatus, pendingRequests = [], showRequestForm = true }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);

  const requestAccess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/rooms/${roomId}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not send the request.");
      setMessage("");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not send the request.");
    } finally {
      setSubmitting(false);
    }
  };

  const decide = async (requestId: string, action: "accept" | "decline") => {
    setActingOn(requestId);
    setError(null);
    try {
      const response = await fetch(`/api/rooms/${roomId}/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not update the request.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update the request.");
    } finally {
      setActingOn(null);
    }
  };

  return (
    <div className="space-y-4">
      {pendingRequests.length > 0 && (
        <section className="premium-panel rounded-[22px] p-4">
          <div className="mb-3 flex items-center gap-2"><UserRoundCheck className="h-4 w-4 text-[#9ccfd8]" /><h2 className="font-semibold text-foreground">Join requests</h2></div>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-border/80 bg-background/30 p-3.5">
                <p className="text-sm font-medium text-foreground">{request.requester.name ?? request.requester.email}</p>
                {request.message && <p className="mt-1 text-sm leading-5 text-muted-foreground">“{request.message}”</p>}
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1 gap-1.5 rounded-xl bg-[#9ccfd8] text-[#191724] hover:bg-[#b4dce3]" disabled={actingOn === request.id} onClick={() => decide(request.id, "accept")}><Check className="h-3.5 w-3.5" /> Accept</Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5 rounded-xl border-border bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground" disabled={actingOn === request.id} onClick={() => decide(request.id, "decline")}><X className="h-3.5 w-3.5" /> Decline</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {showRequestForm && (requestStatus === "PENDING" ? (
        <section className="rounded-[22px] border border-[#9ccfd8]/25 bg-[#31748f]/15 p-4"><p className="text-sm font-semibold text-foreground">Request sent</p><p className="mt-1 text-sm leading-5 text-muted-foreground">The room owner will decide when they are ready to pair.</p></section>
      ) : requestStatus === "DECLINED" ? (
        <section className="premium-panel rounded-[22px] p-4"><p className="text-sm font-semibold text-foreground">This request was declined</p><p className="mt-1 text-sm leading-5 text-muted-foreground">You can send a new, more specific request if the room is still open.</p><RequestForm message={message} setMessage={setMessage} submitting={submitting} onSubmit={requestAccess} /></section>
      ) : requestStatus === "ACCEPTED" ? null : (
        <section className="premium-panel rounded-[22px] p-4"><p className="text-sm font-semibold text-foreground">Request to join</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Tell the owner why you are a useful person to pair with on this problem.</p><RequestForm message={message} setMessage={setMessage} submitting={submitting} onSubmit={requestAccess} /></section>
      ))}

      {error && <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}

function RequestForm({ message, setMessage, submitting, onSubmit }: { message: string; setMessage: (value: string) => void; submitting: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <form className="mt-4 space-y-3" onSubmit={onSubmit}><textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={280} placeholder="I’ve worked through a similar issue and can help debug it." className="min-h-28 w-full resize-none rounded-2xl border border-border bg-background/35 p-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15" /><Button type="submit" className="rose-gradient w-full gap-2 rounded-xl border-0 font-semibold text-primary-foreground" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send request</Button></form>;
}
