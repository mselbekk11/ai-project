import Cog from "./cog";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

export default function InfoTwo() {
  return (
    <div className="w-full max-w-md mx-auto flex mt-20">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="pt-8 pb-4 px-6">
          <div className="space-y-5 text-center">
            <div className="flex justify-center mb-4">
              <Cog mode="loop" size="w-12 h-12" />
            </div>
            <CardTitle className="text-xl font-semibold text-center">
              Training your first Model
            </CardTitle>
            <CardDescription className="text-center">
              I can see you are training your first model. This should be ready
              for you to use in 15-20 minutes
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
