"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INTERVIEW_CATEGORY } from "../../constants/index";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    CalendarIcon,
    CheckCircle2Icon,
    ClockIcon,
    XCircleIcon,
} from "lucide-react";
import { format } from "date-fns";
import CommentDialog from "@/components/CommentDialog";
import { useUserRole } from "@/hooks/useUserRole";

type Interview = Doc<"interviews">;

function DashboardPage() {
    const { user: clerkUser } = useUser();
    const {
        isLoading: roleLoading,
        isInterviewer,
        isCandidate,
    } = useUserRole();

    const allUsers = useQuery(api.users.getUsers);

    const interviewsAsInterviewer = useQuery(
        api.interviews.getAllInterviews,
        isInterviewer ? undefined : "skip"
    );
    const interviewsAsCandidate = useQuery(
        api.interviews.getMyInterviews,
        isCandidate ? undefined : "skip"
    );

    const updateStatus = useMutation(api.interviews.updateInterviewStatus);

    const interviewsToDisplay = isInterviewer
        ? interviewsAsInterviewer
        : interviewsAsCandidate;

    const handleStatusUpdate = async (
        interviewId: Id<"interviews">,
        status: string
    ) => {
        try {
            await updateStatus({ id: interviewId, status });
            toast.success(`Interview marked as ${status}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (
        roleLoading ||
        allUsers === undefined ||
        (isInterviewer && interviewsAsInterviewer === undefined) ||
        (isCandidate && interviewsAsCandidate === undefined)
    ) {
        return <LoaderUI />;
    }

    if (interviewsToDisplay === undefined) {
        return <LoaderUI />;
    }

    const groupedInterviews = groupInterviews(interviewsToDisplay);

    const pageTitle = isInterviewer ? "Interviews Dashboard" : "My Interviews";
    const pageDescription = isInterviewer
        ? "View and manage all scheduled interviews"
        : "View your scheduled interviews and their status";

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center gap-5 flex-wrap justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{pageTitle}</h1>
                    <p className="text-muted-foreground mt-1">
                        {pageDescription}
                    </p>
                </div>
                {isInterviewer && (
                    <Link href="/schedule">
                        <Button>Schedule New Interview</Button>
                    </Link>
                )}
            </div>

            {interviewsToDisplay.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    {isInterviewer
                        ? "No interviews have been scheduled yet."
                        : "You have no scheduled interviews at the moment."}
                </div>
            )}

            {interviewsToDisplay.length > 0 && (
                <div className="space-y-8">
                    {INTERVIEW_CATEGORY.map(
                        (category) =>
                            groupedInterviews[category.id]?.length > 0 && (
                                <section key={category.id}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <h2 className="text-xl font-semibold">
                                            {category.title}
                                        </h2>
                                        <Badge variant={category.variant}>
                                            {
                                                groupedInterviews[category.id]
                                                    .length
                                            }
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupedInterviews[category.id].map(
                                            (interview: Interview) => {
                                                const candidateDetails =
                                                    getCandidateInfo(
                                                        allUsers,
                                                        interview.candidateId
                                                    );

                                                const startTime = new Date(
                                                    interview.startTime
                                                );
                                                const isOwnInterviewForCandidate =
                                                    isCandidate &&
                                                    interview.candidateId ===
                                                        clerkUser?.id;

                                                return (
                                                    <Card
                                                        key={interview._id}
                                                        // Added subtle lift and larger shadow on hover.
                                                        // The 'transition-all' class already handles the animation.
                                                        className="hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                                    >
                                                        <CardHeader className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarImage
                                                                        src={
                                                                            candidateDetails.image
                                                                        }
                                                                        alt={
                                                                            candidateDetails.name
                                                                        }
                                                                    />
                                                                    <AvatarFallback>
                                                                        {
                                                                            candidateDetails.initials
                                                                        }
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <CardTitle className="text-base">
                                                                        {
                                                                            candidateDetails.name
                                                                        }
                                                                        {isOwnInterviewForCandidate && (
                                                                            <span className="text-xs text-muted-foreground ml-1">
                                                                                (Your
                                                                                Interview)
                                                                            </span>
                                                                        )}
                                                                    </CardTitle>
                                                                    <p className="text-sm font-semibold text-foreground mt-0.5">
                                                                        {
                                                                            interview.title
                                                                        }
                                                                    </p>
                                                                    {interview.description && (
                                                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                                            {
                                                                                interview.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </CardHeader>

                                                        <CardContent className="p-4">
                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <CalendarIcon className="h-4 w-4" />
                                                                    {format(
                                                                        startTime,
                                                                        "MMM dd"
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <ClockIcon className="h-4 w-4" />
                                                                    {format(
                                                                        startTime,
                                                                        "hh:mm a"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </CardContent>

                                                        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                                                            {isInterviewer &&
                                                                interview.status ===
                                                                    "completed" && (
                                                                    <div className="flex gap-2 w-full">
                                                                        <Button
                                                                            className="flex-1"
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    interview._id,
                                                                                    "succeeded"
                                                                                )
                                                                            }
                                                                        >
                                                                            <CheckCircle2Icon className="h-4 w-4 mr-2" />{" "}
                                                                            Pass
                                                                        </Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            className="flex-1"
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    interview._id,
                                                                                    "failed"
                                                                                )
                                                                            }
                                                                        >
                                                                            <XCircleIcon className="h-4 w-4 mr-2" />{" "}
                                                                            Fail
                                                                        </Button>
                                                                    </div>
                                                                )}

                                                            {(isInterviewer ||
                                                                isCandidate) && (
                                                                <CommentDialog
                                                                    interviewId={
                                                                        interview._id
                                                                    }
                                                                />
                                                            )}
                                                        </CardFooter>
                                                    </Card>
                                                );
                                            }
                                        )}
                                    </div>
                                </section>
                            )
                    )}
                </div>
            )}
        </div>
    );
}

export default DashboardPage;
