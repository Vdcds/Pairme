---
name: pairme-product
description: "Guide Pairme product, UX, and implementation work toward its focused developer pairing loop. Use for Pairme features, redesigns, roadmaps, data models, and architecture decisions; not for unrelated repositories."
---

# Pairme Product

Pairme is a developer collaboration marketplace, not a generic developer social network. Its central object is a concrete **room/problem**: a developer is stuck, finds a capable collaborator, and enters a focused live pairing session.

## Product test

Before proposing or implementing Pairme work, evaluate whether it improves this loop:

`create problem → discover room → request to join → owner accepts → live pair session → session output → feedback / repeat pairing`

Prioritize the room, its technical problem, and the collaboration outcome over profiles, feeds, follower counts, generic posts, or networking mechanics. If a request meaningfully drifts toward social-network behavior, dashboard bloat, or a browser IDE, say so plainly and offer the smallest pairing-loop-aligned alternative.

## Current product and stack

- Next.js 14 App Router, React, TypeScript, PostgreSQL, Prisma, NextAuth, Tailwind, shadcn/ui, Stream Video, and Stream Chat.
- Users can sign in, create and browse rooms, attach repository and stack context, and join live sessions.
- Keep secrets server-side, use App Router route handlers or server actions appropriately, and keep Prisma access clean.

## Product direction

Treat rooms as serious collaboration objects. The near-term model should be able to support visibility, instant or scheduled timing, stack/tags, difficulty, sought skill or role, GitHub repository and issue/PR context, capacity, owner, participants, and status.

Use room states deliberately: `OPEN`, `REQUESTED`, `MATCHED`, `LIVE`, `COMPLETED`, and `CANCELLED`.

The next MVP loop is:

`create room → public directory → request to join → owner accepts → pair session → complete session → would pair again`

Do not build deeper matchmaking, scheduling complexity, generic ratings, notifications, or broad social features before that loop works well.

The live room coordinates collaboration rather than replacing a developer's editor. Favor Stream Video/Chat, screen sharing, GitHub context, problem brief, lightweight agenda, shared notes/links, and an optional checklist. A completed session should create an artifact: duration, participants, completed checklist, linked issue/PR/commits, notes, links, and optional “would pair again” feedback.

GitHub issue URLs are a high-leverage creation path: extract repository, issue title/body, language, and labels to prefill a room. Pairme should eventually support both “I need help” and time-bounded “I can help” availability.

## Design and engineering stance

Aim for modern developer tooling: dark, sharp, minimal, premium, slightly playful, and compact where useful. Use restrained violet accents, borders, elevated surfaces, subtle glow, useful motion, and polished hovers. Avoid giant gradients, generic AI-SaaS purple, excessive glass, and marketing-dashboard visuals. Make Stream surfaces feel native to Pairme.

Assume the user is technically fluent. Lead with concrete implementation, tradeoffs, and architecture—not basic framework explanations. Prefer TypeScript, production-quality code, small focused components, shadcn/ui where it helps, and no needless abstractions.

For a non-trivial proposed feature, state:

1. Why it belongs in Pairme and its place in the pairing flow.
2. Required data-model and API/backend changes.
3. Key UI states and edge cases.
4. What should explicitly wait.

## Decision metric

Optimize for **completed pair sessions per active developer per month**. Useful supporting measures: join-request conversion, acceptance rate, session completion, repeat pairing, and rooms that yield a PR, issue update, or other useful output.
