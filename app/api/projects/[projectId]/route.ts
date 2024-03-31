import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authoptions";
import { UTApi } from "uploadthing/server";

export async function GET(_req: Request, { params }: { params: { projectId: string } }) {
    try {
        if (!params.projectId) {
            return new NextResponse("project id is required", {
                status: 400,
            });
        }

        const project = await db.project.findUnique({
            where: {
                id: params.projectId,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.log("[PROJECTS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function DELETE(_req: Request, { params }: { params: { projectId: string; } }) {
    try {
        const userId = (await getServerSession(authOptions))?.user?.id;

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });

        if (!params.projectId) return new NextResponse("Project id is required", { status: 400 });

        const projectByUserId = await db.project.findFirst({
            where: {
                id: params.projectId,
                userId,
            },
        });

        if (!projectByUserId) return new NextResponse("Unauthorized", { status: 405 });

        const images = await db.projectImage.findMany({
            where: {
                projectId: params.projectId
            }
        });

        const utapi = new UTApi();
        images.forEach( async (image)=>{
            const newUrl = image.url.substring(image.url.lastIndexOf("/") + 1);
            await utapi.deleteFiles(newUrl);
        })

        await db.projectImage.deleteMany({
            where: {
                projectId: params.projectId
            }
        });

        const project = await db.project.delete({
            where: {
                id: params.projectId,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.log("[PROJECT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function PATCH(req: Request, { params }: { params: { projectId: string; } }) {
    try {
        const userId = (await getServerSession(authOptions))?.user?.id;

        const body = await req.json();

        const { label, description, imageUrl: imageClient }: 
        { label: string; description: string; imageUrl: string[]; } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
        if (!label) return new NextResponse("Label is required", { status: 400 });
        if (!imageClient) return new NextResponse("Image URL is required", { status: 400 });
        const utapi = new UTApi();

        // TODO: tech

        if (!params.projectId) {
            return new NextResponse("Project id is required", {
                status: 400,
            });
        }

        const projectByUserId = await db.project.findFirst({
            where: {
                id: params.projectId,
                userId,
            },
        });

        if (!projectByUserId) return new NextResponse("Unauthorized", { status: 405 });

        const project = await db.project.update({
            where: {
                id: params.projectId,
            },
            data: {
                label,
                description
            },
            include: {
                imageUrl: true
            }
        });

        const imagesDb = await db.projectImage.findMany({
            where: {
                projectId: params.projectId,
            },
        });
        
        const missingImages = imageClient.filter(imageClient => !imagesDb.some(img => img.url === imageClient));

        missingImages.forEach(async (missingImage) => {
            if (!imagesDb.some(img => img.url === missingImage)) {
                await db.projectImage.create({
                    data: {
                        url: missingImage,
                        projectId: params.projectId
                    }
                });
                // console.log("Eklendi: ", missingImage);
            }
        });

        imagesDb.forEach(async (dbImage) => {
            if (!imageClient.includes(dbImage.url)) {
                // console.log("Veritabanında var ancak client tarafında yok:", dbImage.rul);
                await db.projectImage.delete({
                    where: {
                        id: dbImage.id,
                        projectId: params.projectId
                    }
                })
                const newUrl = dbImage.url.substring(dbImage.url.lastIndexOf("/") + 1);
                await utapi.deleteFiles(newUrl);
            }
        });

        return NextResponse.json(project);
    } catch (error) {
        console.log("[PROJECT_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};