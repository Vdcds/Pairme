import React from "react";
import { Room } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRooms } from "@/lib/data-fecther";

export default async function Home() {
  const rooms = await getRooms();

  return (
    <div className="h-screen flex flex-col justify-center items-center overflow-hidden">
      <main className="w-full max-w-6xl mx-auto px-4 lg:px-6 h-full">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
          Welcome to PairMe
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
          Discover and join coding rooms
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto h-[70%]">
          {rooms.map((room: Room) => (
            <Card
              key={room.id}
              className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-xl font-medium text-gray-800 dark:text-gray-200">
                  {room.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Language:</span>{" "}
                    {room.Language}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Github Repo:</span>{" "}
                    {room.GithubRepo}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {room.RoomDescription}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {room.RoomTags}
                  </p>
                </div>
                <Button
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-300"
                  asChild
                >
                  <a href={`/rooms/${room.id}`}>Join This Room</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Button
            className="bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300"
            asChild
          >
            <a href="/create-room">Create New Room</a>
          </Button>
        </div>
      </main>
    </div>
  );
}
