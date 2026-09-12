-- Maps Clerk identities to Pairme's existing application users. A nullable
-- unique column lets legacy NextAuth users be claimed safely on first sign-in.
ALTER TABLE "User" ADD COLUMN "clerkId" TEXT;

CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
