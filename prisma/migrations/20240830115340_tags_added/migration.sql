-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "RoomTags" TEXT NOT NULL DEFAULT 'Room tag is not available';
ALTER TABLE "Session" ADD COLUMN "id" VARCHAR(255);
UPDATE "Session" SET "id" = gen_random_uuid(); -- For PostgreSQL
ALTER TABLE "Session" ALTER COLUMN "id" SET NOT NULL;

