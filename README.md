# Pairme

Pairme is a developer pairing directory. Developers sign in, create a room with a problem brief and repository, then meet in a Stream-powered video session to collaborate.

## Stack

- Next.js 15 (App Router), React, TypeScript
- Neon PostgreSQL + Prisma
- Clerk authentication
- Stream Video
- Tailwind CSS + shadcn/ui primitives

## Run locally

This repository is standardized on PNPM. Enable Corepack once if needed, then install and run:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Copy `.env.example` to `.env.local`, then add the Neon database URL, Clerk keys, and Stream credentials. Use `pnpm build` for a production build and `pnpm seed` to seed Prisma data.

## Deploy to Vercel

Add these environment variables in Vercel for **Production**, **Preview**, and **Development** as appropriate: `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_GET_STREAM_API_KEY`, and `GET_STREAM_SECRET_KEY`. Vercel runs `vercel-build`, which applies the checked-in Prisma migration before building.

In the Clerk dashboard, add your deployed Vercel domain to the allowed origins/redirect URLs. Pairme maps a Clerk identity to the existing database user on the first successful sign-in by email, so existing room ownership and memberships stay intact.

## Design system

The UI uses the existing shadcn/ui component registry in `components.json` and a dark, session-first theme. It is configured to prefer **Wotfard** with a system fallback. Wotfard is available as a free regular download from [Atipo Foundry](https://www.atipofoundry.com/fonts/wotfard); add the licensed webfont files to `public/fonts` and an `@font-face` declaration before production so the exact typeface is shipped rather than the fallback.

## Suggested product direction

1. **Make joining effortless:** add public/private rooms, time slots, a language/tag filter, and a “request to join” flow.
2. **Make sessions useful:** connect GitHub issues/PRs and show a lightweight shared agenda/checklist inside each room.
3. **Create trust and repeat use:** profiles, availability, post-session ratings, and a history of past pairings.
4. **Measure the loop:** track room creation, join requests, completed sessions, and repeat pairings before expanding the feature set.
