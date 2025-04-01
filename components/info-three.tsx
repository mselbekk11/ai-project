import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import Done from "./done";

export default function InfoTwo() {
  return (
    <div className="w-full max-w-md mx-auto flex mt-20">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="pt-8 pb-4 px-6">
          <div className="space-y-5 text-center">
            <div className="flex justify-center mb-4">
              <Done mode="once" size="w-12 h-12" />
            </div>
            <CardTitle className="text-xl font-semibold text-center">
              Your first model is ready
            </CardTitle>
            <CardDescription className="text-center">
              We have trained a model on your face. Try on some clothes using
              the form on the left
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
