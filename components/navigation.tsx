"use client";

import React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import LogoFive from "./logoFive";

const menuItems = [
  { name: "Features", href: "#" },
  { name: "Solution", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About", href: "#" },
  { name: "About", href: "#" },
];

export default function Navigation({
  menuState,
  setMenuState,
}: {
  menuState: boolean;
  setMenuState: (menuState: boolean) => void;
}) {
  return (
    <header className="w-full absolute top-0 z-40 bg-transparent">
      <nav
        data-state={menuState && "active"}
        className="z-20 w-full md:relative dark:bg-transparent lg:dark:bg-transparent"
      >
        <div className="m-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex justify-start lg:w-[180px]">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  {/* <LogoThree /> */}
                  <LogoFive />
                </div>
                <span className="font-extrabold text-1xl text-slate-800">
                  Trizzy
                </span>
              </Link>
            </div>

            <div className="flex lg:hidden">
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 block cursor-pointer p-2.5"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:justify-center">
              <ul className="flex items-center gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden lg:flex lg:w-[180px] lg:items-center lg:justify-end lg:gap-3">
              <SignedOut>
                <SignInButton>
                  <Button size="sm">Sign in</Button>
                </SignInButton>

                <SignUpButton>
                  <Button size="sm" variant="outline" className="">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <SignOutButton>
                  <Button variant="outline" size="sm">
                    Sign out
                  </Button>
                </SignOutButton>

                <Link href="/home">
                  <Button variant="default" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </SignedIn>
            </div>

            <div className="bg-background in-data-[state=active]:block mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:hidden">
              <div>
                <ul className="space-y-6 text-center text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit sm:justify-center">
                <SignedOut>
                  <SignInButton>
                    <Button size="sm" className="w-full">
                      Sign in
                    </Button>
                  </SignInButton>

                  <SignUpButton>
                    <Button size="sm" variant="outline" className="w-full">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <SignOutButton>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign out
                    </Button>
                  </SignOutButton>

                  <Link href="/home" className="w-full">
                    <Button variant="default" size="sm" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
