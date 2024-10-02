"use client";

import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Code,
  Users,
  Plus,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode.toggle";
import { useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const router = useRouter();
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

  return (
    <nav className="bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent group"
              onClick={() => handleNavigation("/")}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center relative overflow-hidden transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3">
                <Code className="w-6 h-6 text-primary-foreground relative z-10" />
                <div className="absolute inset-0 bg-white opacity-20 blur-sm group-hover:opacity-30 group-hover:blur-md transition-all duration-300 ease-in-out"></div>
                <div className="absolute -inset-full z-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-[shine_1.5s_ease-in-out]"></div>
              </div>
              <span className="ml-2 text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-in-out group-hover:bg-gradient-to-br">
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
                className="text-sm flex items-center space-x-1 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              >
                {item.icon}
                <span>{item.name}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 focus:w-64 transition-all duration-300 bg-background border-border focus:border-primary"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            </form>
            <ModeToggle />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-primary/10 transition-colors duration-200"
                  >
                    <Image
                      src={session.user?.image || "/placeholder.png"}
                      alt={session.user?.name || "User"}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium hidden md:inline">
                      {session.user?.name}
                    </span>
                    <ChevronDown size={16} className="text-muted-foreground" />
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
                onClick={() => signIn("google")}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
              >
                Sign in
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
                className="w-full justify-start text-sm hover:bg-primary/10 hover:text-primary transition-colors duration-200"
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
