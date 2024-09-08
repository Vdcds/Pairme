import React from "react";
import { Room } from "@prisma/client";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Laptop, Database, Users, Edit, Trash2 } from "lucide-react";
import { getRooms, deleteRoom } from "@/lib/data-fecther";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const languageEmojis: { [key: string]: string } = {
  JavaScript: "🟨",
  Python: "🐍",
  Java: "☕",
  "C++": "🔷",
  Ruby: "💎",
  Go: "🐹",
  Rust: "🦀",
  TypeScript: "🔵",
  PHP: "🐘",
  Swift: "🍎",
};

export default async function Home() {
  const rooms = await getRooms();

  async function handleDeleteRoom(roomId: string) {
    "use server";
    await deleteRoom(roomId);
    revalidatePath("/");
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 p-4 sm:p-8 flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-light text-stone-700 dark:text-stone-300 mb-4 font-mono">
          Code Collab Rooms
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400 mb-6 font-mono italic">
          Where ideas compile and friendships debug 🚀
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Hosted on Edge", "PostgreSQL", "GetStream.io"].map(
            (tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
              >
                {
                  [
                    <Laptop key="laptop" />,
                    <Database key="database" />,
                    <Users key="users" />,
                  ][index]
                }
                <span className="ml-1">{tech}</span>
              </Badge>
            )
          )}
        </div>
      </header>

      <main className="flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {rooms.map((room: Room) => (
            <Card
              key={room.id}
              className="bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm border-stone-200 dark:border-stone-700"
            >
              <CardHeader>
                <CardTitle className="font-normal text-stone-700 dark:text-stone-300 flex items-center font-mono">
                  {languageEmojis[room.Language] || "💻"} {room.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-600 dark:text-stone-400 font-mono text-sm">
                  {room.Roomtags}
                </p>
              </CardContent>
              <CardFooter className="justify-between">
                <Button
                  asChild
                  variant="default"
                  className="bg-stone-600 hover:bg-stone-700"
                >
                  <Link href={`/rooms/${room.id}`}>Join Room</Link>
                </Button>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link href={`/edit-room/${room.id}`}>
                      <Edit size={16} className="mr-1" /> Edit
                    </Link>
                  </Button>
                  <form action={handleDeleteRoom.bind(null, room.id)}>
                    <Button
                      type="submit"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </form>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button
            asChild
            className="bg-stone-600 hover:bg-stone-700 text-white font-mono"
          >
            <Link href="/create-room">Create New Room</Link>
          </Button>
        </div>
      </main>

      <footer className="mt-8 text-center text-stone-600 dark:text-stone-400 font-mono text-sm">
        Happy Coding! 👩‍💻👨‍💻
      </footer>
    </div>
  );
}
