-- Existing rooms predate explicit membership. Preserve their owners' access
-- before the new join gate is enforced.
INSERT INTO "RoomParticipant" ("id", "roomId", "userId", "role")
SELECT 'owner_' || "id", "id", "userId", 'OWNER'::"RoomParticipantRole"
FROM "Room"
ON CONFLICT ("roomId", "userId") DO NOTHING;
