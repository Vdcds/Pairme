import { prisma } from "@/lib/prisma";

export default async function Home() {
  const user1 = await prisma.user.findFirst({
    where: { email: "aarav.sharma@example.com" },
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-center text-red-200 m-auto p-auto">
        Hi {user1?.name} nice to meet ya
      </h1>
    </main>
  );
}
