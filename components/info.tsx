import Link from "next/link";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

export default function Info() {
  return (
    <div>
      <Card className="w-[400px]">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Welcome to Trizzy</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Please train a model on yourself first</li>
              <li>Come back here and try on some clothes</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/train-model" className="w-full">
            <Button className="w-full">Train Model</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
