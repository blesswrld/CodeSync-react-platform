import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { CodeIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import DashboardBtn from "./DashboardBtn";

function Navbar() {
    return (
        <nav className="border-b bg-background sticky top-0 z-50">
            <div className="flex h-16 items-center px-2 sm:px-4 container mx-auto">
                {/* LEFT SIDE -LOGO */}
                <Link
                    href="/"
                    className="flex items-center gap-1 sm:gap-2 font-semibold text-xl sm:text-2xl mr-2 sm:mr-4 md:mr-6 font-mono hover:opacity-80 transition-opacity"
                >
                    <CodeIcon className="size-7 sm:size-8 text-emerald-500" />{" "}
                    <span className="hidden min-[380px]:inline bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                        CodeSync
                    </span>
                </Link>

                {/* RIGHT SIDE - ACTIONS */}
                <SignedIn>
                    <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-4 ml-auto">
                        <DashboardBtn />
                        <ModeToggle />
                        <UserButton afterSignOutUrl="/" />{" "}
                    </div>
                </SignedIn>
            </div>
        </nav>
    );
}
export default Navbar;
