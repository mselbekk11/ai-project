import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block bg-purple-700"></div>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  );
}
