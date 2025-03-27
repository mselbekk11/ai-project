import { Card, CardContent, CardTitle } from "./ui/card";

export default function InfoThree() {
  return (
    <div>
      <Card className="min-w-[500px]">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold">Congrats!</CardTitle>
            <p>Your first model is ready</p>
            <p>Try on some clothes using the form on the left</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
