"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Code2, Github, Zap } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  language: z.string().min(1, "Please select a language"),
  githubRepo: z
    .string()
    .url("Please enter a valid GitHub URL")
    .or(z.literal("")),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(255, "Description must be less than 255 characters"),
  roomTags: z.array(z.string()).min(1, "Please select at least one tag"),
  zenLevel: z.string().min(1, "Please select your Zen level"),
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

const languages = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "Ruby",
  "Go",
  "Rust",
  "PHP",
  "Swift",
];

const tags = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "Web",
  "AI/ML",
  "DevOps",
  "Data Science",
  "Game Dev",
  "IoT",
];

export default function CreateZenRealmForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      language: "",
      githubRepo: "",
      description: "",
      roomTags: [],
      zenLevel: "",
    },
  });

  useEffect(() => {
    setCurrentQuote(zenQuotes[Math.floor(Math.random() * zenQuotes.length)]);
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!session?.user) {
      setError("Sign in before creating a room.");
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
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to create room");
      }

      const newRoom = await response.json();
      console.log("Room created:", newRoom);
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "We couldn’t create the room. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 md:py-16">
      <Card className="mx-auto w-full max-w-3xl border-border bg-card/85 shadow-2xl shadow-black/30">
        <CardHeader className="border-b border-border pb-6">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">Start a session</p>
          <CardTitle className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Set up a room people want to join.
          </CardTitle>
          <CardDescription className="mt-2 text-base">
            {currentQuote}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Realm Name</FormLabel>
                    <FormControl>
                      <Input className="bg-white/[.03]" placeholder="Debug the checkout flow" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
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
                  name="zenLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
              </div>

              <FormField
                control={form.control}
                name="githubRepo"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>GitHub repository (optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="https://github.com/username/repo"
                          {...field}
                        />
                        <Github className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomTags"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>What do you need help with?</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Button
                            key={tag}
                            type="button"
                            variant={
                              field.value.includes(tag) ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => {
                              const updatedTags = field.value.includes(tag)
                                ? field.value.filter((t) => t !== tag)
                                : [...field.value, tag];
                              field.onChange(updatedTags);
                            }}
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>Brief</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What are you trying to solve? Add enough context for the right person to join."
                        {...field}
                        className="h-24 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {status !== "authenticated" ? <Button type="button" onClick={() => signIn(process.env.NODE_ENV === "development" ? "dev-guest" : "google")} className="w-full gap-2"><Code2 className="h-4 w-4" /> Sign in to create a room</Button> : <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating room...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" /> Create room
              </>
            )}
          </Button>}
          {error && <p className="text-destructive text-center">{error}</p>}
          <p className="text-center text-muted-foreground text-sm">
            Your room is visible to people searching for a good pairing session.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
