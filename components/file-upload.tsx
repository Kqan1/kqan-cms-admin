"use client";
import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";
import { Dispatch, SetStateAction, useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";

interface FileUploadProps {
    onChange: (urls: string[]) => void;
    value: string[];
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>
}

export const FileUpload = ({ onChange, value, loading, setLoading }: FileUploadProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    if ( value && value.length > 0) {
        return (
            <div className="grid grid-cols-3 grid-row-3 gap-2">
                <AlertModal 
                    isOpen={open}
                    loading={loading}
                    onClose={()=>setOpen(!open)}
                    onConfirm={()=>{
                        const updatedFiles = [...value];
                        updatedFiles.splice(index, 1);
                        onChange(updatedFiles);
                        setOpen(!open);
                    }}
                />
                {value.map((url, index) => (
                    <div 
                        key={index} 
                        className="relative h-60 aspect-video border rounded bg-cover bg-no-repeat bg-center"
                        style={{ backgroundImage: `url(${url})` }}
                    >
                        <button
                            disabled={loading}
                            onClick={() => {
                                setIndex(index);
                                setOpen(!open);
                            }}
                            className="bg-rose-500 text-white p-1 rounded-full absolute top-2 right-2 shadow-sm"
                            type="button"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                ))}
                <UploadDropzone
                    endpoint="projectImage"
                    onClientUploadComplete={(res: any) => {
                        const urls = res.map((file: any) => file.url);
                        onChange([...value, ...urls]);
                    }}
                    onUploadError={(error: Error) => {
                        console.log(error);
                    }}
                    className="mt-0"
                />
            </div>
        );
    }

    return (
        <UploadDropzone
            endpoint="projectImage"
            onClientUploadComplete={(res: any) => {
                const urls = res.map((file: any) => file.url);
                onChange([...value, ...urls]);
                setLoading(false);
            }}
            onUploadError={(error: Error) => {
                console.log(error);
            }}
            onUploadBegin={() => {setLoading(true);}}
            className="mt-0"
        />
    );
};