import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Homepage() {
  return (
    <>
      <header className="flex justify-end items-center p-4 gap-4 h-[5vh] border-b-2 border-slate-200 dark:border-slate-200">
        <SignedOut>
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>

          <SignUpButton>
            <Button variant="outline">Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="h-[95vh] flex flex-col gap-8 max-w-lg mx-auto items-center justify-center">
        <h1>Homepage</h1>
      </div>
    </>
  );
}
