# Pairme

Pairme is a developer pairing directory. Developers sign in, create a room with a problem brief and repository, then meet in a Stream-powered video session to collaborate.

## Stack

- Next.js 14 (App Router), React, TypeScript
- PostgreSQL + Prisma
- NextAuth with Google sign-in
- Stream Video and Chat
- Tailwind CSS + shadcn/ui primitives

## Run locally

This repository is standardized on PNPM. Enable Corepack once if needed, then install and run:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Create a `.env` file with the database, NextAuth, Google OAuth, and Stream credentials required by the existing integrations. Use `pnpm build` for a production build and `pnpm seed` to seed Prisma data.

For authentication, copy `.env.example` to `.env.local`, set a strong `NEXTAUTH_SECRET`, and create a Google OAuth web client. Add `http://localhost:3000/api/auth/callback/google` as its local redirect URI (and the equivalent production URL before deploying). In development, Pairme offers a clearly marked guest session so the room flow can be tested without Google credentials; that provider is never enabled in production.

## Design system

The UI uses the existing shadcn/ui component registry in `components.json` and a dark, session-first theme. It is configured to prefer **Wotfard** with a system fallback. Wotfard is available as a free regular download from [Atipo Foundry](https://www.atipofoundry.com/fonts/wotfard); add the licensed webfont files to `public/fonts` and an `@font-face` declaration before production so the exact typeface is shipped rather than the fallback.

## Suggested product direction

1. **Make joining effortless:** add public/private rooms, time slots, a language/tag filter, and a “request to join” flow.
2. **Make sessions useful:** connect GitHub issues/PRs and show a lightweight shared agenda/checklist inside each room.
3. **Create trust and repeat use:** profiles, availability, post-session ratings, and a history of past pairings.
4. **Measure the loop:** track room creation, join requests, completed sessions, and repeat pairings before expanding the feature set.
