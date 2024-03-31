"use client";
import Link from "next/link";
import MainNav from "@/components/header/main-nav";
import MaxWidthWrapper from "@/components/maxwidthwrapper";
import { ThemeToggle } from "@/components/theme-toggle";

import { Menu, Package2, Search } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileDropdown from "@/components/header/profile-dropdown";

export default function Header() {
    return (
        <header className="border-b bg-background">
            <MaxWidthWrapper className="flex h-16 items-center gap-4 px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:!flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Zencistan</span>
                </Link>
                <MainNav />
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="font-semibold">Zencistan</span>
                        </Link>
                        <MainNav />
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search projects..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                        />
                    </div>
                </form>
                <ThemeToggle />
                <ProfileDropdown />
            </div>
            </MaxWidthWrapper>
        </header>
    );
}
