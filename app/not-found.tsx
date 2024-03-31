"use client";
import { usePathname } from "next/navigation";

export default function NotFound() {
    const pathname = usePathname();

    return (
        <div className="h-screen w-full grid place-items-center">
            <div className="text-center space-y-4">
                <h2 className="font-mono font-bold text-7xl">404</h2>
                <p>{pathname} could not be found</p>
            </div>
        </div>
    );
};