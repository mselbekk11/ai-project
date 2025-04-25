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
// import LogoTwo from "./logoTwo";
// import LogoThree from "./logoThree";
import LogoFive from "./logoFive";
// import LogoFour from "./logoFour";

// Import useSidebar hook
import { useSidebar } from "@/components/ui/sidebar";

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
  // Get the setOpenMobile function from the sidebar context
  const { setOpenMobile } = useSidebar();

  // Function to handle navigation link click
  const handleNavClick = () => {
    // Close the mobile sidebar when a navigation link is clicked
    setOpenMobile(false);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-12 border-b p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/home"
                className="hover:bg-transparent"
                onClick={handleNavClick}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  {/* <img src="/logo2.png" alt="Trizzy Logo" className="size-4" /> */}
                  {/* <LogoTwo /> */}
                  {/* <LogoFour /> */}
                  {/* <LogoThree /> */}
                  <LogoFive />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-1xl font-heading">
                    Trizzy
                  </span>
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
                    onClick={handleNavClick}
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
              <UserDropdown setOpenMobile={setOpenMobile} />
            </div>
          </SignedIn>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
