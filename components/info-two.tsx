import { Card, CardContent, CardTitle } from "./ui/card";

export default function InfoTwo() {
  return (
    <div>
      <Card className="min-w-[500px]">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold">Congrats!</CardTitle>
            <p>I can see you are training your first model</p>
            <p>This should be ready for you to use in 15-20 minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
