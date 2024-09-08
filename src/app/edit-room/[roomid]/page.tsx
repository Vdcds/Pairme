import { prisma } from "@/lib/prisma";

export default async function RoomPage({
  params,
}: {
  params: { roomid: string };
}) {
  const roomid = params.roomid;

  if (!roomid) {
    // Handle the case where roomid is missing or invalid
    return <div>Room ID is missing or invalid.</div>;
  }

  const room = await prisma.room.findUnique({
    where: {
      id: String(roomid),
    },
  });

  if (!room) {
    // Handle the case where the room is not found
    return <div>Room not found.</div>;
  }

  // Render the room data
  return <div>{/* Your room data rendering here */}</div>;
}
