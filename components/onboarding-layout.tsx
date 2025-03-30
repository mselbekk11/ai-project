import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { InfiniteSliderVertical } from "./InfiniteSliderVertical";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function OnboardingLayout({ children }: AuthLayoutProps) {
  const imageUrls = [
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIAzDKIkphjb6xpPYIw2ZvA4Ry7ndSkB5eg9KGm",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIApoBJ8IAD2Z7AjUfI91Pk4O0MiaCzJxNlbtLm",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIAH2STNt6VQk7cayU4jBhJTP6Rvs2mXG0q95nd",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIAZsceIgR4ucyrXYGtDN9MT4Fj0nIeHif218aw",
    },
  ];

  const badImageUrls = [
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIApHSci9vAD2Z7AjUfI91Pk4O0MiaCzJxNlbtL",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIA1aDa67UBSu0Ulsp478qzCKALVMacHmG3yJFb",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIAV1AUqkWwA4x2fJcqlWTnUK5d8Brbt3ODMZip",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIA5125fhog5Y7Vf4SZFxrpIRKDjTBU3XoatczO",
    },
  ];

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative bg-muted bg-purple-700 flex flex-col items-center justify-center">
        <Card className="rounded-md mb-4  border-2 bg-sidebar">
          <CardHeader>
            <CardTitle className="text-md  font-semibold font-heading text-indigo-700">
              Choose good pictures
            </CardTitle>
            <CardDescription className="text-sm">
              5-10 high quality images, front-facing, 1 person in the frame,
              variety
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {imageUrls.map((item, idx) => (
                <div key={idx}>
                  <Image
                    src={item.url}
                    alt={`Image ${idx + 1}`}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-md mb-4  border-2 bg-sidebar">
          <CardHeader>
            <CardTitle className="text-md  font-semibold font-heading text-indigo-700">
              Examples of bad pictures
            </CardTitle>
            <CardDescription className="text-sm">
              Multiple people, blurry, uncropped, low quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {badImageUrls.map((item, idx) => (
                <div key={idx}>
                  <Image
                    src={item.url}
                    alt={`Image ${idx + 1}`}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* <InfiniteSliderVertical /> */}
      </div>
      <div className="flex flex-col gap-4 p-6 bg-shapes-pattern">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
