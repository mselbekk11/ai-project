"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";

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
import UserDropdown from "./user-dropdown";
// import Logo from "./logo";
import LogoTwo from "./logoTwo";

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
    // {
    //   title: "Gallery",
    //   url: "/gallery",
    //   icon: <Zap className="size-4" />,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home" className="hover:bg-transparent">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  {/* <img src="/logo2.png" alt="Trizzy Logo" className="size-4" /> */}
                  <LogoTwo />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Trizzy</span>
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
        <div className="mt-auto p-2">
          <SignedIn>
            <div className="flex items-center gap-3">
              <UserDropdown />
            </div>
          </SignedIn>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
