import React from "react";
import { getRoom, deleteRoom } from "@/lib/data-fecther";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Code } from "lucide-react";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
const ClientVideoPlayer = dynamic(
  () =>
    import("@/components/video-player").then((mod) => mod.ClientVideoPlayer),
  { ssr: false },
);

export default async function RoomPage({
  params,
}: {
  params: { roomid: string };
}) {
  const roomId = params.roomid;
  const room = await getRoom(roomId);
  const session = await getServerSession(authOptions);

  if (!room) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <p className="text-xl font-semibold">Room not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || !session.user.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <p className="text-xl font-semibold">
              You must be signed in to view this room.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleDeleteRoom() {
    "use server";
    try {
      await deleteRoom(roomId);
      revalidatePath("/rooms");
      redirect("/rooms");
    } catch (error) {
      console.error("Failed to delete room:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-3">
          <Card className=" text-lg text-center border-2 border-black shadow-md shadow-black overflow-hidden">
            <CardHeader className="bg-gray-800  text-white p-4">
              <CardTitle className="text-2xl font-bold">{room.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-w-16 aspect-h-9">
                <ClientVideoPlayer room={room} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Metadata Section */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Room Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Language
                </h3>
                <Badge variant="secondary" className="mt-1">
                  <Code className="w-4 h-4 mr-1" />
                  {room.Language}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  GitHub Repo
                </h3>
                <a
                  href={room.GithubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-500 hover:underline mt-1"
                >
                  <Github className="w-4 h-4 mr-1" />
                  {room.GithubRepo}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {room.description}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge className="bg-background"> {room.Roomtags}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delete Room Form */}
          <form action={handleDeleteRoom}>
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Delete Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
