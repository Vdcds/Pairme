import React from "react";
import { getRoom } from "@/lib/data-fecther";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Code, Users } from "lucide-react";

export default async function RoomPage(props: { params: { roomid: string } }) {
  const roomId = props.params.roomid;
  const room = await getRoom(roomId);

  if (!room) {
    return <div className="text-center p-8">Room not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
            <CardHeader className="bg-gray-800 dark:bg-gray-700 text-white p-4">
              <CardTitle className="text-2xl font-bold">{room.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-w-16 aspect-h-9 bg-black">
                {/* Replace this with your actual video player component */}
                <div className="flex items-center justify-center h-full text-white">
                  Video Player Placeholder
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Metadata Section */}
        <div>
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Room Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Language:</span>
                <Badge variant="secondary">{room.RoomTags}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="font-medium">Github Repo:</span>
                <a
                  href={room.GithubRepo}
                  className="text-blue-500 hover:underline truncate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {room.GithubRepo}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-500" />
                <span className="font-medium">Participants:</span>
                <span>{room.name || 0}</span>
              </div>
              <div>
                <h3 className="font-medium mb-2">Description:</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {room.GithubRepo}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
