import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authoptions";

export async function POST(req: Request) {
    try {
        const userId = (await getServerSession(authOptions))?.user?.id;

        const body = await req.json();

        // TODO: tech
        const { label, description, imageUrl }: 
        { label: string; description: string; imageUrl: string[]; } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });

        if (!description) return new NextResponse("Description is required", { status: 400 });

        if (!label) return new NextResponse("Label is required", { status: 400 });

        if (!imageUrl) return new NextResponse("Image URL is required", { status: 400 });

        const projects = await db.project.create({
            data: {
                label,
                description,
                userId
            }
        });

        imageUrl.forEach( async element => {
            await db.projectImage.create({
                data: {
                    url: element, 
                    projectId: projects.id
                }
            });
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.log("[PROJECTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    const userId = (await getServerSession(authOptions))?.user?.id;
    
    try {
        const projects = await db.project.findMany({
            where: {
                userId
            },
            include: {
                imageUrl: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.log("[PROJECTS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};