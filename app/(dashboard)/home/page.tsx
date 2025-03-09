"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  const models = useQuery(api.headshot_models.listUserModels, {
    user_id: user?.id ?? "",
  });

  if (!models) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <div className="container px-4 py-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your models</CardTitle>
              <Link href="/train-model">
                <Button>Train model</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Images</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model._id}>
                      <TableCell className="font-medium">
                        {model.name}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-600 hover:bg-blue-600">
                          {model.status ?? "processing"}
                        </Badge>
                      </TableCell>
                      <TableCell>{model.gender ?? "unknown"}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {model.images.slice(0, 3).map((image, index) => (
                            <Avatar
                              key={index}
                              className={index > 0 ? "-ml-2" : ""}
                            >
                              <AvatarImage src={image} alt="Sample image" />
                              <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                          ))}
                          {model.images.length > 3 && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              +{model.images.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
