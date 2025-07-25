"use client";

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { CodeIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import DashboardBtn from "./DashboardBtn";
import { MobileNav } from "./MobileNav";
import { motion } from "framer-motion";

// MotionLink для ссылки
const MotionLink = motion(Link);

function Navbar() {
    return (
        <nav className="h-16 border-b bg-background sticky top-0 z-50 animate-in fade-in duration-500">
            <div className="flex h-full items-center flex-wrap px-2 sm:px-4 container mx-auto">
                {/* LEFT SIDE -LOGO */}
                <div className="flex-1">
                    <MotionLink
                        href="/"
                        className="inline-flex items-center gap-1 sm:gap-2 font-semibold text-xl sm:text-2xl mr-2 sm:mr-4 md:mr-6 font-mono transition-transform ease-out"
                        whileHover={{ scale: 1.05, rotate: -0.05 }}
                        transition={{
                            type: "spring",
                            duration: 0.3,
                        }}
                    >
                        <CodeIcon className="size-7 sm:size-8 text-emerald-500 transition-transform duration-200" />
                        <span className="hidden min-[380px]:inline bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            CodeSync
                        </span>
                    </MotionLink>
                </div>
                {/* RIGHT SIDE - ACTIONS */}
                <SignedIn>
                    {/* Контейнер для десктопной версии */}
                    <div className="hidden sm:flex items-center space-x-1.5 sm:space-x-2 md:space-x-4 ml-auto animate-in slide-in-from-right-8 duration-500 ease-out delay-150">
                        <DashboardBtn />
                        <ModeToggle />
                        <UserButton afterSignOutUrl="/" />
                    </div>
                    {/* Контейнер для мобильной версии */}
                    <div className="sm:hidden h-full relative flex items-center">
                        <MobileNav />
                    </div>
                </SignedIn>
            </div>
        </nav>
    );
}

export default Navbar;
