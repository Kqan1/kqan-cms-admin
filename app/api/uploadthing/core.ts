import { authOptions } from "@/utils/authoptions";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
    const userId = (await getServerSession(authOptions))?.user?.id;
    if(!userId) {
        throw new Error("unauthorized");
    };
    return { userId: userId };
};

export const ourFileRouter = {
    projectImage: f({
        image: { 
            maxFileSize: "64MB", 
            maxFileCount: 10,
        }
    })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
