"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
        <div className="container">
          <Card className="border-none rounded-none">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-800 hover:bg-transparent">
                    <TableHead className="h-12 px-4 text-sm text-zinc-400 font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="h-12 px-4 text-sm text-zinc-400 font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="h-12 px-4 text-sm text-zinc-400 font-semibold">
                      Type
                    </TableHead>
                    <TableHead className="h-12 px-4 text-sm text-zinc-400 font-semibold">
                      Images
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-b border-zinc-800">
                  {models.map((model) => (
                    <TableRow
                      key={model._id}
                      className="border-b border-zinc-800 hover:bg-zinc-900/50"
                    >
                      <TableCell className="py-0 h-12 px-4 text-sm text-white">
                        {model.name}
                      </TableCell>
                      <TableCell className="py-0 h-12 px-4">
                        <Badge className="bg-zinc-800 text-white hover:bg-zinc-800">
                          {model.status ?? "processing"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-0 h-12 px-4 text-sm text-zinc-400">
                        {model.gender ?? "unknown"}
                      </TableCell>
                      <TableCell className="py-0 h-12 px-4">
                        <div className="flex items-center">
                          {model.images.slice(0, 3).map((image, index) => (
                            <Avatar
                              key={index}
                              className={`w-6 h-6 border border-zinc-800 ${index > 0 ? "-ml-2" : ""}`}
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
