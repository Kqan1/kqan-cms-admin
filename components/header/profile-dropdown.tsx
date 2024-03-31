"use client";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { type Session } from "next-auth";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileDropdown() {
    const { data: Session, status } = useSession();

    switch (status) {
        case "loading":
            return <Loading />;
        case "authenticated":
            return <Authenticated session={Session} />;
        case "unauthenticated":
            return <Unauthenticated />;
        default:
            return <p>error</p>;
    }
};

// TODO: make dropdown
export function Authenticated({ session }: { session: Session }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="secondary"
                    size="icon"
                    className="relative rounded-full overflow-hidden"
                >
                    <Image 
                        src={session.user?.image ? session.user?.image : "/pp/error.svg"}
                        alt={session.user?.image ? `${session.user?.image}'s profile photo` : "profile photo could not found"}
                        fill
                    />
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export function Unauthenticated() {
    return (
        <Button onClick={() => signIn()}>
            Sign in
        </Button>
    );
};

function Loading() {
    return (
        <Skeleton className="size-9 rounded-full" />
    );
};