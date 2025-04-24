import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { X } from "lucide-react";
import Image from "next/image";

export default function BadPictures() {
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
    <Card className="rounded-sm mb-4 bg-sidebar">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-semibold font-heading flex items-center">
          <X className="w-4 h-4 mr-2 text-red-500" />
          Examples of bad pictures
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Multiple people, blurry, low quality
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {badImageUrls.map((item, idx) => (
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
