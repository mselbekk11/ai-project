"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Monitor, Sun, Moon, MoreHorizontal } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";

export default function UserDropdown() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { user } = useUser();

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Register keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Command/Ctrl key
      if (e.metaKey || e.ctrlKey) {
        if (e.shiftKey) {
          // Command+Shift+P for Profile
          if (e.key === "p") {
            e.preventDefault();
            console.log("Navigate to Profile");
          }
          // Command+Shift+B for Billing
          else if (e.key === "b") {
            e.preventDefault();
            console.log("Navigate to Billing");
          }
          // Command+Shift+S for Sign out
          else if (e.key === "s") {
            e.preventDefault();
            console.log("Sign out");
          }
        }
        // Command+K for Command Menu
        else if (e.key === "k") {
          e.preventDefault();
          console.log("Open Command Menu");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full focus-visible:ring-0 data-[state=open]:bg-accent"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={`${user?.firstName} ${user?.lastName}`}
                  />
                  {/* <AvatarFallback>MS</AvatarFallback> */}
                </Avatar>
                <span className="text-sm font-semibold">{`${user?.firstName} ${user?.lastName}`}</span>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>
          {/* <UserButton /> */}
          {/* {user && (
                <span className="text-sm text-muted-foreground">
                  {`${user.firstName} ${user.lastName}`}
                </span>
              )} */}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-60 border">
          <div className="px-2 py-2">
            <p className="font-medium text-sm">{`${user?.firstName} ${user?.lastName}`}</p>
            <p className="text-xs text-gray-400">{`${user?.emailAddresses[0].emailAddress}`}</p>
          </div>
          <DropdownMenuSeparator className="" />
          {/* <DropdownMenuItem className="py-2 cursor-pointer flex justify-between">
            <div className="flex items-center">
              <span>Profile</span>
            </div>
            <span className="text-xs text-gray-400">⌘ ⇧ P</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 cursor-pointer flex justify-between">
            <div className="flex items-center">
              <span>Settings</span>
            </div>
            <span className="text-xs text-gray-400">⌘ ⇧ B</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 cursor-pointer flex justify-between">
            <div className="flex items-center">
              <span>Billing</span>
            </div>
            <span className="text-xs text-gray-400">⌘ K</span>
          </DropdownMenuItem> */}

          <DropdownMenuItem className="py-2 cursor-default focus:bg-transparent">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="mr-2">Theme</span>
              </div>
              <div className="flex space-x-1 border rounded-2xl p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 rounded-full ${
                    theme === "system" ? "bg-accent" : ""
                  }`}
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="h-4 w-4" />
                  <span className="sr-only">System theme</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 rounded-full ${
                    theme === "light" ? "bg-accent" : ""
                  }`}
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-4 w-4" />
                  <span className="sr-only">Light theme</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 rounded-full ${
                    theme === "dark" ? "bg-accent" : ""
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-4 w-4" />
                  <span className="sr-only">Dark theme</span>
                </Button>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="" />
          <SignOutButton>
            <DropdownMenuItem className="py-2 cursor-pointer flex justify-between">
              <div className="flex items-center">
                <span>Sign out</span>
              </div>
              <span className="text-xs text-gray-400">⌘ ⇧ S</span>
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
