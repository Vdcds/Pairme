"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editRoomAction } from "@/app/edit-room/[roomid]/actions";
import { useParams } from "next/navigation";
import { Room } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  githubRepo: z.string().optional(),
  tags: z.string().optional(),
  language: z.string().optional(),
  zenLevel: z.string().optional(),
});

export default function EditRoomForm({ room }: { room: Room }) {
  const params = useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room.name,
      description: room.description ?? "",
      githubRepo: room.GithubRepo ?? "",
      tags: room.Roomtags.join(", ") || "",
      language: room.Language ?? "",
      zenLevel: room.ZenLevel ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Convert tags from string to array
      const updatedValues: Partial<Omit<Room, "id" | "userId">> = {
        ...values,
        Roomtags: values.tags
          ? values.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      await editRoomAction(params.roomid as string, updatedValues);
      toast({
        title: "Room Updated",
        description: "Your room was successfully updated",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} className="h-11 rounded-xl border-border bg-background/35" placeholder="Debug the checkout flow" />
              </FormControl>
              <FormDescription>This is your public room name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-11 rounded-xl border-border bg-background/35"
                  placeholder="What are you trying to solve?"
                />
              </FormControl>
              <FormDescription>
                Please describe what you are coding on.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="githubRepo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Repo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-11 rounded-xl border-border bg-background/35"
                  placeholder="https://github.com/username/repo"
                />
              </FormControl>
              <FormDescription>
                Please put a link to the project you are working on.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input {...field} className="h-11 rounded-xl border-border bg-background/35" placeholder="typescript, nextjs, tailwind" />
              </FormControl>
              <FormDescription>
                List your programming languages, frameworks, libraries so people
                can find your content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input {...field} className="h-11 rounded-xl border-border bg-background/35" placeholder="TypeScript" />
              </FormControl>
              <FormDescription>
                Specify the main language for your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zenLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zen Level</FormLabel>
              <FormControl>
                <Input {...field} className="h-11 rounded-xl border-border bg-background/35" placeholder="Adept" />
              </FormControl>
              <FormDescription>
                Indicate the zen level of the room.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="rose-gradient h-11 w-full rounded-xl border-0 font-semibold text-primary-foreground">Save room</Button>
      </form>
    </Form>
  );
}
