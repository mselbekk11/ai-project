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
                  <TableRow className="border-b hover:bg-transparent">
                    <TableHead className="h-12 px-4 text-sm  font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="h-12 px-4 text-sm font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="h-12 px-4 text-sm font-semibold">
                      Type
                    </TableHead>
                    <TableHead className="h-12 px-4 text-sm font-semibold">
                      Images
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-b ">
                  {models.map((model) => (
                    <TableRow key={model._id} className="border-b  hover">
                      <TableCell className="py-0 h-12 px-4 text-sm">
                        {model.name}
                      </TableCell>
                      <TableCell className="py-0 h-12 px-4">
                        <Badge className="">
                          {model.status ?? "processing"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-0 h-12 px-4 text-sm">
                        {model.gender ?? "unknown"}
                      </TableCell>
                      <TableCell className="py-0 h-12 px-4">
                        <div className="flex items-center">
                          {model.images.slice(0, 3).map((image, index) => (
                            <Avatar
                              key={index}
                              className={`w-6 h-6 border  ${index > 0 ? "-ml-2" : ""}`}
                            >
                              <AvatarImage src={image} alt="Sample image" />
                              <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                          ))}
                          {model.images.length > 3 && (
                            <Avatar className="w-6 h-6 -ml-2 ">
                              <AvatarFallback className="text-xs">
                                +{model.images.length - 3}
                              </AvatarFallback>
                            </Avatar>
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
