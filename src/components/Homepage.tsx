import React from "react";
import { Room } from "@prisma/client";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Laptop, Database, Users, Edit, Trash2, Code } from "lucide-react";
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

// Custom styles for the component

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const rooms = await getRooms(searchParams.search);

  async function handleDeleteRoom(roomId: string) {
    "use server";
    await deleteRoom(roomId);
    revalidatePath("/");
  }

  return (
    <>
      <div className="min-h-screen p-8 flex flex-col w-full mesh-background text-gray-800">
        <header className="mb-12 text-center pb-8">
          <h1 className="text-6xl font-extrabold uppercase mb-6 text-gray-900">
            Pairme
          </h1>
          <p className="text-xl font-mono mb-6  text-white">
            A local place where I can chill
            <Code className="inline m-4" />
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Hosted on Edge", "PostgreSQL", "GetStream.io"].map(
              (tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-md shadow-sm button-pop"
                >
                  {
                    [
                      <Laptop key="laptop" />,
                      <Database key="database" />,
                      <Users key="users" />,
                    ][index]
                  }
                  <span className="font-semibold">{tech}</span>
                </Badge>
              ),
            )}
          </div>
        </header>

        <main className="flex-grow">
          <div className="grid grid-cols-1 p-5 m-5 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {rooms.map((room: Room) => (
              <Card
                key={room.id}
                className="bg-white text-gray-800 rounded-lg shadow-md p-6 m-6 shadow-red-100 border-black border-2"
              >
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    {"💻"} {room.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 mb-6">
                  <p className="font-mono text-lg">{room.Roomtags}</p>
                </CardContent>
                <CardFooter className="p-0 flex justify-between items-center">
                  <Button
                    asChild
                    variant="default"
                    className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-sm button-pop hover:bg-gray-500"
                  >
                    <Link href={`/rooms/${room.id}`}>Join Room</Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="bg-white text-gray-800 px-4 py-2 rounded-md shadow-sm button-pop"
                    >
                      <Link href={`/edit-room/${room.id}`}>
                        <Edit size={16} className="mr-2" /> Edit
                      </Link>
                    </Button>
                    <form action={handleDeleteRoom.bind(null, room.id)}>
                      <Button
                        type="submit"
                        variant="ghost"
                        className="text-red-600 px-4 py-2 rounded-md shadow-sm button-pop"
                      >
                        <Trash2 size={16} className="mr-2" /> Delete
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
              className="bg-gray-800 text-white px-6 py-3 text-xl font-bold rounded-md shadow-md button-pop"
            >
              <Link href="/create-room">Create New Room</Link>
            </Button>
          </div>
        </main>

        <footer className="mt-12 text-center text-xl font-mono text-gray-700">
          Happy Coding! 👩‍💻👨‍💻
        </footer>
      </div>
    </>
  );
}
