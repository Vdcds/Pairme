import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma, withDatabaseRetry } from "@/lib/prisma";

export type PairmeUser = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  image: string | null;
};

/**
 * Resolves the signed-in Clerk user to Pairme's application user. Existing
 * NextAuth users are claimed by email on their first Clerk sign-in, preserving
 * their rooms, participants, and pending requests.
 */
export async function getCurrentUser(): Promise<PairmeUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  if (!clerkUser || !email) {
    throw new Error("Your Clerk account needs a verified email address to use Pairme.");
  }

  const name = clerkUser.fullName || clerkUser.username || null;
  const image = clerkUser.imageUrl || null;

  return withDatabaseRetry(async () => {
    const existingByClerkId = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (existingByClerkId) {
      return prisma.user.update({
        where: { id: existingByClerkId.id },
        data: { name, image },
        select: { id: true, clerkId: true, email: true, name: true, image: true },
      }) as Promise<PairmeUser>;
    }

    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      return prisma.user.update({
        where: { id: existingByEmail.id },
        data: { clerkId: userId, name, image },
        select: { id: true, clerkId: true, email: true, name: true, image: true },
      }) as Promise<PairmeUser>;
    }

    return prisma.user.create({
      data: { clerkId: userId, email, name, image },
      select: { id: true, clerkId: true, email: true, name: true, image: true },
    }) as Promise<PairmeUser>;
  });
}

export async function requireCurrentUser(): Promise<PairmeUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Sign in to continue.");
  return user;
}
