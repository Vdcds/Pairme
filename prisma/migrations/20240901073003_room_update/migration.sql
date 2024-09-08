/*
  Warnings:

  - You are about to drop the column `RoomDescription` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `RoomTags` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "RoomDescription",
DROP COLUMN "RoomTags",
ADD COLUMN     "Roomtags" TEXT[] DEFAULT ARRAY['typeScript, javascript']::TEXT[],
ADD COLUMN     "ZenLevel" TEXT NOT NULL DEFAULT 'Master',
ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'Embrace the silence of an empty description.',
ALTER COLUMN "Language" SET DEFAULT 'TypeScript/Javascript',
ALTER COLUMN "GithubRepo" SET DEFAULT 'Arghhhh Its Still Local';

-- CreateIndex
CREATE INDEX "Room_userId_idx" ON "Room"("userId");
