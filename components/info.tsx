import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Upload } from "lucide-react";

export default function Info() {
  return (
    <div className="w-full max-w-md mx-auto flex mt-20">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="pt-8 pb-4 px-6">
          <div className="space-y-5 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <Upload className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-center">
              Welcome to Trizzy
            </CardTitle>
            <CardDescription className="text-center">
              You don&apos;t have any trained models yet. To get started with
              Trizzy, you&apos;ll need to train an AI model on your face.
            </CardDescription>
          </div>
        </CardContent>
        <CardFooter className="pb-6 px-6">
          <div className="w-full text-center">
            <Link href="/train-model">
              <Button>Train Model</Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
