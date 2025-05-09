"use client";

import LoaderUI from "@/components/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole";
import InterviewScheduleUI from "./InterviewScheduleUI";

function SchedulePage() {
    const { isLoading } = useUserRole();

    if (isLoading) return <LoaderUI />;

    return <InterviewScheduleUI />;
}

export default SchedulePage;
