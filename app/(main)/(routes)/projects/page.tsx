import { format } from "date-fns";
import { db } from "@/lib/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authoptions";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Client from "./components/client";

export default async function ProjectsPage() {
    const Session = await getServerSession(authOptions);
    
    const projects = await db.project.findMany({
        where: {
            userId: Session?.user?.id
        },
        include: {
            imageUrl: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Projects(${projects.length})`}
                    description="configure or create projects"
                />
                <Link href="/projects/new" className={buttonVariants()}>
                    <Plus className="size-4 mr-4" />
                    <span>Add New</span>
                </Link>
            </div>
            <Separator className="my-2" />
            <Client 
                projects={projects}
            />
        </>
    );
};