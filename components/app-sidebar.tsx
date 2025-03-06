import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

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

const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
    },
    {
      title: "Contacts",
      url: "#",
    },
    {
      title: "Boom",
      url: "#",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="hover:bg-transparent">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">TryAI</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
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
