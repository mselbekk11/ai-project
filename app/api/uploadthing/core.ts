import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 20
    }
  })
    .middleware(async () => {
      // This code runs on your server before upload
      return {}; 
    })
    .onUploadComplete(async ({ file }) => {
      // This code RUNS ON YOUR SERVER after upload
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 