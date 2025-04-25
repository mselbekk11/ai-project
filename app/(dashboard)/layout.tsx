"use client";

import { AppSidebar } from "@/components/app-sidebar";
import CreditsBadge from "@/components/credits-badge";
// import NavTitle from "@/components/NavTitle";
// import NavButton from "@/components/NavButton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  // SidebarTrigger,
} from "@/components/ui/sidebar";
import { useInitializeUser } from "@/hooks/useInitializeUser";
import { ThemeProvider } from "@/components/layout/theme-provider";
// import { Separator } from "@/components/ui/separator";

type Props = {
  children: React.ReactNode;
};

export default function Page({ children }: Props) {
  useInitializeUser(); // This will initialize credits for new users

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b bg-sidebar">
            <div className="flex items-center justify-between w-full px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{/* <NavTitle /> */}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              {/* <NavButton /> */}
              {/* <Credits /> */}
              <CreditsBadge />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
