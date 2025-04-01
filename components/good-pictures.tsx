import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CircleCheck } from "lucide-react";
import Image from "next/image";

export default function GoodPictures() {
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

  return (
    <Card className="rounded-sm mb-4 bg-sidebar">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-semibold font-heading flex items-center">
          <CircleCheck className="w-4 h-4 mr-2 text-green-500" />
          Choose good pictures
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          5-10 high quality images, front-facing, 1 person in the frame, variety
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {imageUrls.map((item, idx) => (
            <div key={idx}>
              <Image
                src={item.url}
                alt={`Image ${idx + 1}`}
                width={100}
                height={100}
                className="rounded-sm"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
