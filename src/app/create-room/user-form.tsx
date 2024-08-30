"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  Language: z
    .string()
    .min(2, "Language must be at least 2 characters")
    .max(50, "Language must be less than 50 characters"),
  GithubRepo: z
    .string()
    .min(6, "GitHub repo must be at least 6 characters")
    .max(50, "GitHub repo must be less than 50 characters"),
  RoomDescription: z
    .string()
    .min(10, "Room description must be at least 10 characters")
    .max(255, "Room description must be less than 255 characters"),
  Roomtags: z
    .string()
    .min(10, "Room description must be at least 10 characters")
    .max(255, "Room description must be less than 255 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateRoomForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      Language: "",
      GithubRepo: "",
      RoomDescription: "",
      Roomtags: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!session?.user) {
      setError("You must be logged in to create a room.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomData: {
            ...values,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          user: session.user,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const newRoom = await response.json();
      console.log("Room created successfully:", newRoom);
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Error creating room:", error);
      setError("Failed to create room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter room name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Programming Language</FormLabel>
              <FormControl>
                <Input placeholder="Enter programming language" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="RoomDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Description </FormLabel>
              <FormControl>
                <Input
                  placeholder="Describe what You gonna Code here"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="GithubRepo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Repository</FormLabel>
              <FormControl>
                <Input placeholder="Enter GitHub repository" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Roomtags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags for this room</FormLabel>
              <FormControl>
                <Input placeholder="Tailwind GSAP etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button
          type="submit"
          disabled={isLoading || status !== "authenticated"}
          className="w-full"
        >
          {isLoading ? "Creating..." : "Create Room"}
        </Button>
      </form>
    </Form>
  );
}
