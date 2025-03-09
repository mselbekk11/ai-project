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

export default function Home() {
  // Sample data for the models
  const models = [
    {
      id: 1,
      name: "Morgan",
      status: "finished",
      type: "man",
      samples: [
        "/placeholder.svg?height=40&width=40",
        "/placeholder.svg?height=40&width=40",
        "/placeholder.svg?height=40&width=40",
      ],
      extraSamples: 1,
    },
    {
      id: 2,
      name: "Morgan Viking",
      status: "finished",
      type: "man",
      samples: [
        "/placeholder.svg?height=40&width=40",
        "/placeholder.svg?height=40&width=40",
        "/placeholder.svg?height=40&width=40",
      ],
      extraSamples: 5,
    },
    {
      id: 3,
      name: "Morgan Viking",
      status: "finished",
      type: "man",
      samples: [],
      extraSamples: 0,
    },
  ];

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <div className="container px-4 py-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your models</CardTitle>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Train model
              </Button>
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
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">
                        {model.name}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-600 hover:bg-blue-600">
                          {model.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{model.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {model.samples.slice(0, 3).map((sample, index) => (
                            <Avatar
                              key={index}
                              className={index > 0 ? "-ml-2" : ""}
                            >
                              <AvatarImage src={sample} alt="Sample image" />
                              <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                          ))}
                          {model.extraSamples > 0 && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              +{model.extraSamples}
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
