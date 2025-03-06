"use client";

import {
  Authenticated,
  Unauthenticated,
  // useMutation,
  // useQuery,
} from "convex/react";
import Dashboard from "@/components/dashbaord";
import Homepage from "@/components/Homepage";

export default function Home() {
  return (
    <main className="flex flex-col h-100vh">
      <Authenticated>
        <Dashboard />
      </Authenticated>
      <Unauthenticated>
        <Homepage />
      </Unauthenticated>
    </main>
  );
}
