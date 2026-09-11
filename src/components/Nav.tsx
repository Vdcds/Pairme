"use client";

import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Search,
  Code,
  CircleUserRound,
  Users,
  Plus,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { name: "Home", href: "/", icon: <Code className="w-4 h-4" /> },
    {
      name: "Join Room",
      href: "/join-room",
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "New Room",
      href: "/create-room",
      icon: <Plus className="w-4 h-4" />,
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  const handleSignIn = () => {
    const provider = process.env.NODE_ENV === "development" ? "dev-guest" : "google";
    signIn(provider, { callbackUrl: pathname || "/" });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent group"
              onClick={() => handleNavigation("/")}
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform duration-200 group-hover:-rotate-6">
                <Code className="h-5 w-5" />
              </div>
              <span className="ml-2 text-lg font-semibold tracking-tight text-white">
                PairMe
              </span>
            </Button>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => handleNavigation(item.href)}
                className="text-sm text-muted-foreground hover:bg-white/[.05] hover:text-white transition-colors duration-200"
              >
                {item.icon}
                <span>{item.name}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 rounded-full border-border bg-white/[.04] pr-9 text-white transition-all duration-300 placeholder:text-muted-foreground focus:w-64 focus:border-primary"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            </form>
            {status === "loading" ? <div className="h-9 w-20 animate-pulse rounded-full bg-white/[.06]" /> : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 rounded-full hover:bg-white/[.06] transition-colors duration-200"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary"><CircleUserRound className="h-4 w-4" /></span>
                    <span className="text-sm font-medium hidden md:inline">
                      {session.user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      onClick={() => signOut()}
                      className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleSignIn}
                size="sm"
                className="rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
              >
                {process.env.NODE_ENV === "development" ? "Try as guest" : "Continue with Google"}
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-primary/10 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
          <div className="px-4 py-2 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start text-sm hover:bg-white/[.05] hover:text-white transition-colors duration-200"
                onClick={() => handleNavigation(item.href)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Button>
            ))}
            <form onSubmit={handleSearch} className="relative mt-2">
              <Input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border-border focus:border-primary"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
