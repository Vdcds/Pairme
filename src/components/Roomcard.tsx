"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Room } from "@prisma/client";
import { motion } from "framer-motion";
import { Plus, LogIn, Code, Github, FileText, Tag } from "lucide-react";

type RoomCardProps = {
  rooms: Room[];
};

export default function RoomCards({ rooms }: RoomCardProps) {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900  border-2 border-white rounded-md shadow-md w-full">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {room.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Code className="mr-2 h-4 w-4" />
                  <span className="font-medium">Language:</span>
                  <span className="ml-2">{room.Language}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Github className="mr-2 h-4 w-4" />
                  <span className="font-medium">Github Repo:</span>
                  <span className="ml-2 truncate">{room.GithubRepo}</span>
                </div>
                <div className="flex items-start text-gray-700 dark:text-gray-200">
                  <FileText className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                  <p className="text-sm">{room.RoomDescription}</p>
                </div>
                <div className="flex items-start text-gray-700 dark:text-gray-200">
                  <Tag className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                  <p className="text-sm">{room.RoomTags}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700"
                  >
                    <LogIn className="mr-2 h-4 w-4" /> Join Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="mt-10 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
          <Plus className="mr-2 h-5 w-5" /> Create Room
        </Button>
      </motion.div>
    </div>
  );
}
