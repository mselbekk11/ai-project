"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { House, Brain } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: <House className="size-4" />,
    },
    {
      title: "Train model",
      url: "/train-model",
      icon: <Brain className="size-4" />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home" className="hover:bg-transparent">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">TryAI</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={`flex items-center gap-2 font-medium ${
                      pathname === item.url
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu></SidebarMenu>
        </SidebarGroup>
        <div className="mt-auto p-4">
          <SignedIn>
            <div className="flex items-center gap-3">
              <UserButton />
              {user && (
                <span className="text-sm text-muted-foreground">
                  {`${user.firstName} ${user.lastName}`}
                </span>
              )}
            </div>
          </SignedIn>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
