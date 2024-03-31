"use client";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import { Trash } from "lucide-react";
import { Project, ProjectImage } from "@prisma/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
    label: z.string().min(1),
    description: z.string().min(1),
    imageUrl: z.string().array().min(1, { message: "At least one image must be found." })
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
    initialData: (Project & { imageUrl: string[] }) | null;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData?.id ? "Edit Project" : "Create Project";
    const description = initialData?.id ? "Edit a Project." : "Add a new Project";
    const toastMessage = initialData?.id ? "Project updated." : "Project created.";
    const action = initialData?.id ? "Save changes" : "Create";

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            description: "",
            imageUrl: [""]
        },
    });

    const onSubmit = async (data: ProjectFormValues) => {
        try {
            setLoading(true);
            if (initialData?.id) {
                await axios.patch(`/api/projects/${params.projectId}`, data);
            } else {
                await axios.post(`/api/projects`, data);
            }
            router.refresh();
            router.push(`/projects`);
            toast(toastMessage);
        } catch (error: any) {
            toast("Something went wrong.");
        } finally {
            setLoading(false);
            console.log("data: ", data);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/projects/${params.projectId}`);
            router.refresh();
            router.push("/projects");
            toast("Project deleted.");
        } catch (error: any) {
            toast("Make sure you removed all categories using this Project first.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData?.id && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator className="my-2" />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <div className="flex gap-4">
                                        <FileUpload 
                                            value={field.value}
                                            onChange={field.onChange}
                                            loading={loading}
                                            setLoading={setLoading}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="md:grid md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Project label"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="md:grid md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={loading}
                                            placeholder="Project description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            disabled={loading}
                            className=""
                            type="submit"
                        >
                            {action}
                        </Button>
                        <Button
                            disabled={loading}
                            variant="destructive"
                            type="button"
                            onClick={() => router.push("/projects")}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};