"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  Language: z.string().default("TypeScript/Javascript"),
  GithubRepo: z.string().default("Arghhhh Its Still Local"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(255, "Description must be less than 255 characters"),
  Roomtags: z.array(z.string()).default(["typeScript", "javascript"]),
  ZenLevel: z.string().default("Master"),
});

type FormValues = z.infer<typeof formSchema>;

const zenLevels = [
  { value: "Novice", label: "Novice (Still chasing bugs)" },
  { value: "Adept", label: "Adept (Bugs fear you)" },
  { value: "Master", label: "Master (One with the code)" },
  { value: "Enlightened", label: "Enlightened (You are the code)" },
];

const zenQuotes = [
  "The code flows through you. Be the code.",
  "In the silence between keystrokes, wisdom grows.",
  "Embrace the bug, for it teaches patience.",
  "Clean code is not written, it is rewritten.",
];

export function CreateZenRealmForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      Language: "TypeScript/Javascript",
      GithubRepo: "Arghhhh Its Still Local",
      description: "",
      Roomtags: ["typeScript", "javascript"],
      ZenLevel: "Master",
    },
  });

  useEffect(() => {
    setCurrentQuote(zenQuotes[Math.floor(Math.random() * zenQuotes.length)]);
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!session?.user) {
      setError("Authenticate to manifest your realm.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomData: values,
          user: session.user,
        }),
      });

      if (!response.ok) throw new Error("Failed to create room");

      const newRoom = await response.json();
      console.log("Realm manifested:", newRoom);
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      setError("The universe hiccupped. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-2xl space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
        >
          <div className="text-center">
            <h2 className="text-3xl font-light text-gray-700 dark:text-gray-300 mb-2">
              Craft Your Zen Coding Realm
            </h2>
            <p className="text-gray-500 dark:text-gray-400 italic text-sm">
              {currentQuote}
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Realm Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tranquil Terminal"
                    {...field}
                    className="bg-gray-50 dark:bg-gray-700"
                  />
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
                <FormLabel>Code Dialect</FormLabel>
                <FormControl>
                  <Input
                    placeholder="TypeScript/Javascript"
                    {...field}
                    className="bg-gray-50 dark:bg-gray-700"
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
                <FormLabel>GitHub Sanctuary</FormLabel>
                <FormControl>
                  <Input
                    placeholder="mindful-codebase"
                    {...field}
                    className="bg-gray-50 dark:bg-gray-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ZenLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zen Mastery</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                      <SelectValue placeholder="Select your path" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {zenLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Realm Essence</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="In the stillness of code, creativity blooms..."
                    {...field}
                    className="bg-gray-50 dark:bg-gray-700 h-24"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading || status !== "authenticated"}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white dark:bg-gray-600 dark:hover:bg-gray-500 text-sm py-2 transition-all duration-300"
          >
            {isLoading ? "Manifesting..." : "Create Zen Realm"}
          </Button>
        </form>
      </Form>

      {error && <p className="mt-4 text-red-500 dark:text-red-400">{error}</p>}

      <footer className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Code with intention, debug with patience.</p>
      </footer>
    </div>
  );
}
