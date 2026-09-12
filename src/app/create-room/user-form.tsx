"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SignInButton, useUser } from "@clerk/nextjs";
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
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import type { PairingProblem } from "@/lib/problems";

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

export default function CreateZenRealmForm({ initialProblem }: { initialProblem?: PairingProblem }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialProblem ? `Pair on ${initialProblem.title}` : "",
      language: initialProblem?.source === "Codeforces" ? "C++" : initialProblem ? "TypeScript" : "",
      githubRepo: "",
      description: initialProblem ? `${initialProblem.summary} ${initialProblem.pairingPrompt}` : "",
      roomTags: initialProblem?.tags ?? [],
      zenLevel: initialProblem ? "Adept" : "",
    },
  });

  useEffect(() => {
    setCurrentQuote(zenQuotes[Math.floor(Math.random() * zenQuotes.length)]);
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!isSignedIn) {
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
          roomData: {
            ...values,
            roomTags: initialProblem
              ? Array.from(new Set([...values.roomTags, `problem:${initialProblem.slug}`]))
              : values.roomTags,
          },
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to create room");
      }

      const newRoom = await response.json();
      console.log("Room created:", newRoom);
      router.push(`/rooms/${newRoom.id}`);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "We couldn’t create the room. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="premium-panel premium-keyline overflow-hidden rounded-[28px]">
        <CardHeader className="border-b border-border/80 px-6 pb-6 pt-7 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">Session brief</p>
          <CardTitle className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
            Set the room up for a useful match.
          </CardTitle>
          <CardDescription className="mt-2 text-base">
            {currentQuote}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-7 sm:px-8">
          {initialProblem && (
            <div className="mb-7 rounded-2xl border border-[#c4a7e7]/20 bg-[#c4a7e7]/[0.07] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#c4a7e7]">Selected problem</p>
                  <p className="mt-1 text-base font-semibold text-foreground">{initialProblem.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{initialProblem.source} · {initialProblem.difficulty}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild type="button" variant="outline" size="sm" className="rounded-lg border-border bg-card/60 text-foreground hover:bg-secondary"><a href={initialProblem.url} target="_blank" rel="noreferrer">Brief <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></a></Button>
                  <Button asChild type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"><Link href="/problems" aria-label="Choose a different problem"><X className="h-4 w-4" /></Link></Button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">This brief will be pinned under the call for everyone in the room.</p>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Realm Name</FormLabel>
                    <FormControl>
                      <Input className="h-11 rounded-xl border-border bg-background/35" placeholder="Debug the checkout flow" {...field} />
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
                          <SelectTrigger className="h-11 rounded-xl border-border bg-background/35">
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
                          <SelectTrigger className="h-11 rounded-xl border-border bg-background/35">
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
                          className="h-11 rounded-xl border-border bg-background/35 pr-10"
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
                            className={`rounded-full ${field.value.includes(tag) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background/30 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
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
                        className="min-h-32 resize-none rounded-2xl border-border bg-background/35 p-3.5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-border/80 bg-background/20 px-6 py-6 sm:px-8">
          {!isLoaded ? <Button type="button" disabled className="h-11 w-full rounded-xl"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading account…</Button> : !isSignedIn ? <SignInButton mode="modal"><Button type="button" className="rose-gradient h-11 w-full gap-2 rounded-xl border-0 font-semibold text-primary-foreground"><Code2 className="h-4 w-4" /> Sign in to create a room</Button></SignInButton> : <Button
            type="submit"
            disabled={isLoading}
            className="rose-gradient h-11 w-full rounded-xl border-0 font-semibold text-primary-foreground"
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
