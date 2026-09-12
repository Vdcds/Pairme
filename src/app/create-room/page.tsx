import CreateZenRealmForm from "./user-form";
import { getPairingProblem } from "@/lib/problems";

const CreateRoomPage = async ({ searchParams }: { searchParams?: Promise<{ problem?: string }> }) => {
  const resolvedSearchParams = await searchParams;
  const initialProblem = getPairingProblem(resolvedSearchParams?.problem);
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto mb-8 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#ebbcba]">Create a pairing room</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">Give the right developer a reason to join.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">A strong brief gets better requests. Name the blocker, share the stack, and keep the session focused.</p>
      </div>
      <CreateZenRealmForm initialProblem={initialProblem} />
    </main>
  );
};

export default CreateRoomPage;
