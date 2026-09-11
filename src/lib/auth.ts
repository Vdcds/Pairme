import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, DefaultSession, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const isGoogleAuthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

const providers: AuthOptions["providers"] = [];

if (isGoogleAuthConfigured) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  );
}

// Lets contributors verify protected flows locally without shipping a backdoor.
if (process.env.NODE_ENV === "development") {
  providers.push(
    CredentialsProvider({
      id: "dev-guest",
      name: "Development guest",
      credentials: {},
      async authorize() {
        const user = await prisma.user.upsert({
          where: { email: "guest@pairme.local" },
          update: {},
          create: { email: "guest@pairme.local", name: "Pairme Guest" },
        });

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  );
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers,
  pages: { signIn: "/" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ token, session }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
};

export function getSession() {
  return getServerSession(authOptions);
}
