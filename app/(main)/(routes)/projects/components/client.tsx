"use client"
import { Project, ProjectImage } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectsClientProps {
    projects: (Project & { imageUrl: ProjectImage[] })[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {isMounted ? 
                projects.map(project => (
                    <Link href={`/projects/${project.id}`} key={project.id} className="flex flex-col gap-1 justify-between border p-2 rounded">
                        <div>
                            <div 
                                className={`relative aspect-video bg-no-repeat bg-cover bg-center border rounded`}
                                style={{ backgroundImage: `url(${project.imageUrl.length >= 1 ? project.imageUrl[0].url : "/error.svg"})`}}
                            ></div>
                            <div className="space-y-1">
                                <div className="text-sm md:text-base font-medium transition line-clamp-2">
                                    {project.label}
                                </div>
                                <div className="text-xs text-accent-foreground line-clamp-3">
                                    {project.description}
                                </div>
                            </div>
                        </div>
                    </Link>
                )) : <LoadingComponent />
            }
        </div>
    );
};

function LoadingComponent() {
    return (
        <>
            {Array.from({ length: 8 }).map((_element, index)=> (
                <Skeleton key={index} className="flex flex-col gap-1 justify-between border p-2 rounded">
                    <>
                        <div className="space-y-2">
                            <Skeleton className="aspect-video border rounded bg-gray-200" />
                            <div className="space-y-2">
                                <Skeleton className="h-7 w-8/12 bg-gray-200" />
                                <Skeleton className="h-5 w-full bg-gray-200" />
                                <Skeleton className="h-5 w-full bg-gray-200" />
                                <Skeleton className="h-5 w-5/12 bg-gray-200" />
                            </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Skeleton className="w-16 h-9 bg-gray-200" />
                            <Skeleton className="w-14 h-9 bg-gray-200" />
                            <Skeleton className="size-9 bg-gray-200" />
                        </div>
                    </>
                </Skeleton>
            ))}
        </>
    );
};