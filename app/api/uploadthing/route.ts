import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Create route handler with callback URL configuration
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
}); 