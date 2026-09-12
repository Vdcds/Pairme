import { PrismaClient } from "@prisma/client";
// Prisma Client is attached to the global object in development
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const transientNeonErrors = new Set(["P1001", "P1002", "P1008", "P2024"]);

/** Neon may briefly reject the first connection when a compute wakes from idle. */
export async function withDatabaseRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (const delay of [0, 500, 1_200]) {
    if (delay) await wait(delay);
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!transientNeonErrors.has((error as { code?: string }).code ?? "")) throw error;
    }
  }

  throw lastError;
}
