// prisma.ts
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // In production mode, create a new PrismaClient instance on each request
  prisma = new PrismaClient();
} else {
  // In development mode, use a global variable to avoid creating multiple PrismaClient instances
  // See https://pris.ly/d/help-global-client
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export default prisma;
