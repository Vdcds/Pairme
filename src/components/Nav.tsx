"use client";

import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ChevronDown,
  BookOpen,
  Code2,
  LogOut,
  Menu,
  Plus,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Rooms", href: "/", icon: Users },
    { name: "Join", href: "/join-rooms", icon: Code2 },
    { name: "Problems", href: "/problems", icon: BookOpen },
  ];

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const handleNavigation = (href: string) => { router.push(href); setIsMenuOpen(false); };
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/join-rooms?q=${encodeURIComponent(query)}` : "/join-rooms");
    setIsMenuOpen(false);
  };
  const handleSignIn = () => signIn(process.env.NODE_ENV === "development" ? "dev-guest" : "google", { callbackUrl: pathname || "/" });

  // The homepage owns its navigation in the editorial left rail. Keeping the
  // global bar there would repeat the same choices and flatten the layout.
  if (pathname === "/") return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/75 bg-[#191724]/82 backdrop-blur-2xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => handleNavigation("/")} className="group flex shrink-0 items-center gap-2.5" aria-label="Pairme home">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary transition group-hover:border-primary/50 group-hover:bg-primary/15">
            <Code2 className="h-[18px] w-[18px]" />
          </div>
          <span className="hidden text-[15px] font-semibold tracking-[-0.025em] text-foreground sm:block">Pairme</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.href} type="button" onClick={() => handleNavigation(item.href)} className={`flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition ${isActive(item.href) ? "border border-border bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"}`}>
                <Icon className="h-4 w-4" /> {item.name}
              </button>
            );
          })}
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <form onSubmit={handleSearch} className="relative w-full max-w-[420px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search rooms, stacks, problems…" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-9 w-full rounded-xl border-border/80 bg-card/65 pl-9 pr-12 text-sm text-foreground placeholder:text-[#6e6a86] focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/30" />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">/</kbd>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" onClick={() => handleNavigation("/create-room")} className="rose-gradient hidden h-9 gap-2 rounded-xl border-0 px-3.5 font-semibold text-primary-foreground shadow-none hover:opacity-95 sm:flex">
            <Plus className="h-4 w-4" /> New room
          </Button>

          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-secondary" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex h-9 items-center gap-2 rounded-xl border border-border bg-card/70 px-2.5 text-sm text-muted-foreground transition hover:border-accent/30 hover:bg-secondary hover:text-foreground">
                  <div className="grid h-6 w-6 place-items-center rounded-lg bg-accent/10 text-accent"><UserRound className="h-3.5 w-3.5" /></div>
                  <span className="hidden max-w-28 truncate lg:block">{session.user?.name ?? "Developer"}</span>
                  <ChevronDown className="hidden h-3.5 w-3.5 lg:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-2xl border-border bg-popover/95 p-1.5 text-popover-foreground shadow-2xl backdrop-blur-2xl">
                <div className="px-3 py-2.5"><p className="truncate text-sm font-medium text-foreground">{session.user?.name ?? "Developer"}</p>{session.user?.email && <p className="mt-0.5 truncate text-xs text-muted-foreground">{session.user.email}</p>}</div>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-secondary focus:text-foreground"><UserRound className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer rounded-xl px-3 py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" variant="ghost" onClick={handleSignIn} className="h-9 rounded-xl border border-border bg-card/65 px-3.5 text-muted-foreground hover:bg-secondary hover:text-foreground">{process.env.NODE_ENV === "development" ? "Try as guest" : "Sign in"}</Button>
          )}

          <button type="button" aria-label="Toggle navigation" onClick={() => setIsMenuOpen((value) => !value)} className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card/65 text-muted-foreground transition hover:bg-secondary hover:text-foreground md:hidden">
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute inset-x-0 top-[68px] border-b border-border bg-[#191724]/96 p-4 shadow-2xl backdrop-blur-2xl md:hidden">
          <form onSubmit={handleSearch} className="relative mb-4"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" placeholder="Search rooms…" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-10 rounded-xl border-border bg-card pl-9 text-foreground placeholder:text-muted-foreground" /></form>
          <div className="space-y-1">
            {navItems.map((item) => { const Icon = item.icon; return <button key={item.href} type="button" onClick={() => handleNavigation(item.href)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive(item.href) ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"}`}><Icon className="h-4 w-4" />{item.name}</button>; })}
            <button type="button" onClick={() => handleNavigation("/create-room")} className="rose-gradient mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> New room</button>
          </div>
        </div>
      )}
    </nav>
  );
}
