"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { SparkleIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

function DashboardBtn() {
    const { isLoading, isInterviewer, isCandidate } = useUserRole();

    if (isLoading) {
        return null;
    }

    if (!isInterviewer && !isCandidate) {
        return null;
    }

    return (
        <Link href={"/dashboard"}>
            <Button className="gap-2 font-medium" size={"sm"}>
                <SparkleIcon className="size-4" />
                Dashboard
            </Button>
        </Link>
    );
}

export default DashboardBtn;
