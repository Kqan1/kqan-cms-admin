import { ProjectForm } from "./components/projects-form";
import { db } from "@/lib/db";

export default async function ProjectId({ params }: { params: { projectId: string; }; }) {
    const projects = await db.project.findUnique({
        where: {
            id: params.projectId
        }, include: {
            imageUrl: true
        }
    })

    const formattedImages: string[] = [];
    projects?.imageUrl.map((img)=>{
        formattedImages.push(img.url);
    })

    const formattedProjects: any = {
        id: projects?.id,
        label: projects?.label,
        description: projects?.description,
        createdAt: projects?.createdAt,
        imageUrl: formattedImages
    }

    return (
        <>
            <ProjectForm
                initialData={formattedProjects} 
            />
        </>
    );
};