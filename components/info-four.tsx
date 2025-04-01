import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Upload } from "lucide-react";

export default function InfoFour() {
  return (
    <div className="w-full max-w-md mx-auto flex mt-20">
      <Card className="border-none shadow-none bg-sidebar">
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
            <div className="space-y-4 mt-4">
              <div className="rounded-lg bg-white dark:bg-slate-900 p-4">
                <h4 className="mb-2 text-sm font-semibold">How it works:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-left">
                  <li>Upload 5-10 clear, front-facing photos of yourself</li>
                  <li>Name your model and choose your gender</li>
                  <li>
                    Wait for training to complete (usually takes 15-20 minutes)
                  </li>
                  <li>Try on virtual outfits with your new AI model!</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-6 px-6">
          <div className="w-full text-center">
            <p className="text-sm mb-2 text-muted-foreground">
              Start by uploading your photos in the form on the left
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
