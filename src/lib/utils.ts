import { clsx, type ClassValue } from "clsx";
import {
    addHours,
    intervalToDuration,
    isAfter,
    isBefore,
    isWithinInterval,
} from "date-fns";
import { twMerge } from "tailwind-merge";
import { Doc } from "../../convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Interview = Doc<"interviews">;
type User = Doc<"users">;

export type GroupedInterviews = {
    upcoming: Interview[];
    completed: Interview[];
    succeeded: Interview[];
    failed: Interview[];
};

export const groupInterviews = (
    interviews: Interview[] | undefined
): GroupedInterviews => {
    const grouped: GroupedInterviews = {
        upcoming: [],
        completed: [],
        succeeded: [],
        failed: [],
    };

    if (!interviews || interviews.length === 0) {
        return grouped;
    }

    const now = new Date();

    for (const interview of interviews) {
        const interviewStartTime = new Date(interview.startTime);

        if (interview.status === "succeeded") {
            grouped.succeeded.push(interview);
        } else if (interview.status === "failed") {
            grouped.failed.push(interview);
        } else if (interview.status === "completed") {
            grouped.completed.push(interview);
        } else if (interview.status === "upcoming") {
            if (isAfter(interviewStartTime, now)) {
                grouped.upcoming.push(interview);
            } else {
                grouped.completed.push(interview);
            }
        } else {
            if (isAfter(interviewStartTime, now)) {
                grouped.upcoming.push(interview);
            } else {
                grouped.completed.push(interview);
            }
        }
    }
    return grouped;
};

export const getCandidateInfo = (
    users: User[] | undefined,
    candidateId: string | undefined
) => {
    if (!users) {
        return { name: "Loading User...", image: "", initials: "L" };
    }
    if (!candidateId) {
        return { name: "N/A", image: "", initials: "N" };
    }
    const candidate = users.find((user) => user.clerkId === candidateId);
    if (!candidate) {
        return {
            name: `ID: ${candidateId.substring(0, 6)}...`,
            image: "",
            initials: candidateId[0]?.toUpperCase() || "C",
        };
    }
    return {
        name: candidate.name || "Unknown Candidate",
        image: candidate.image || "",
        initials:
            candidate.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "UC",
    };
};

export const getInterviewerInfo = (users: User[], interviewerId: string) => {
    const interviewer = users?.find((user) => user.clerkId === interviewerId);
    return {
        name: interviewer?.name || "Unknown Interviewer",
        image: interviewer?.image,
        initials:
            interviewer?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "UI",
    };
};

export const calculateRecordingDuration = (
    startTime: string,
    endTime: string
) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const duration = intervalToDuration({ start, end });

    if (duration.hours && duration.hours > 0) {
        return `${duration.hours}:${String(duration.minutes).padStart(2, "0")}:${String(
            duration.seconds
        ).padStart(2, "0")}`;
    }

    if (duration.minutes && duration.minutes > 0) {
        return `${duration.minutes}:${String(duration.seconds).padStart(2, "0")}`;
    }

    return `${duration.seconds} seconds`;
};

export const getMeetingStatus = (interview: Interview) => {
    const now = new Date();
    const interviewStartTime = interview.startTime;
    const endTime = addHours(interviewStartTime, 1);

    if (
        interview.status === "completed" ||
        interview.status === "failed" ||
        interview.status === "succeeded"
    )
        return "completed";
    if (isWithinInterval(now, { start: interviewStartTime, end: endTime }))
        return "live";
    if (isBefore(now, interviewStartTime)) return "upcoming";
    return "completed";
};
