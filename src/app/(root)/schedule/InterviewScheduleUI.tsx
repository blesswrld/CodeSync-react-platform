"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "../../constants/index";
import MeetingCard from "@/components/MeetingCard";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import LoaderUI from "@/components/LoaderUI";
import { DialogTrigger } from "@radix-ui/react-dialog";

function InterviewScheduleUI() {
    const client = useStreamVideoClient();
    const { user } = useUser();
    const router = useRouter();
    const {
        isLoading: roleLoading,
        isInterviewer,
        isCandidate,
    } = useUserRole();

    const [isSchedulingDialogOpen, setIsSchedulingDialogOpen] = useState(false);

    const [isCreating, setIsCreating] = useState(false);

    const allUsers = useQuery(api.users.getUsers) ?? [];
    const createInterview = useMutation(api.interviews.createInterview);

    const existingInterviews = useQuery(api.interviews.getAllInterviews) ?? [];

    const availableCandidates = allUsers?.filter((u) => u.role === "candidate");
    const availableInterviewers = allUsers?.filter(
        (u) => u.role === "interviewer"
    );

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: [] as string[],
    });

    useEffect(() => {
        if (isCandidate && user?.id) {
            setFormData((prev) => ({
                ...prev,
                candidateId: user.id,
            }));
        } else if (isInterviewer && user?.id) {
            setFormData((prev) => ({
                ...prev,
                interviewerIds: [user.id],
                candidateId: "",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                candidateId: "",
                interviewerIds: [],
            }));
        }
    }, [isCandidate, isInterviewer, user?.id]);

    const scheduleMeeting = async () => {
        if (!client || !user) return;
        if (!formData.candidateId) {
            toast.error("Please select a candidate.");
            return;
        }
        if (formData.interviewerIds.length === 0 && isInterviewer) {
            toast.error(
                "As an interviewer, please select at least one interviewer (yourself included)."
            );
            return;
        }

        setIsCreating(true);

        try {
            const {
                title,
                description,
                date,
                time,
                candidateId,
                interviewerIds,
            } = formData;
            const [hours, minutes] = time.split(":");
            const meetingDate = new Date(date);
            meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

            if (!title.trim()) {
                toast.error("Please provide an interview title.");
                setIsCreating(false);
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call("default", id);

            await call.getOrCreate({
                data: {
                    starts_at: meetingDate.toISOString(),
                    custom: {
                        description: title,
                        additionalDetails: description,
                    },
                },
            });

            await createInterview({
                title,
                description,
                startTime: meetingDate.getTime(),
                status: "upcoming",
                streamCallId: id,
                candidateId,
                interviewerIds,
            });

            setIsSchedulingDialogOpen(false);
            toast.success("Meeting scheduled successfully!");
            router.push("/dashboard");
            setFormData({
                title: "",
                description: "",
                date: new Date(),
                time: "09:00",
                candidateId: isCandidate && user?.id ? user.id : "",
                interviewerIds: isInterviewer && user?.id ? [user.id] : [],
            });
        } catch (error) {
            console.error("Error scheduling meeting:", error);
            toast.error("Failed to schedule meeting. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    const addInterviewer = (interviewerId: string) => {
        if (!formData.interviewerIds.includes(interviewerId)) {
            setFormData((prev) => ({
                ...prev,
                interviewerIds: [...prev.interviewerIds, interviewerId],
            }));
        }
    };

    const removeInterviewer = (interviewerId: string) => {
        if (
            isInterviewer &&
            user?.id === interviewerId &&
            formData.interviewerIds.length === 1
        ) {
            toast.error("You cannot remove yourself as the only interviewer.");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            interviewerIds: prev.interviewerIds.filter(
                (id) => id !== interviewerId
            ),
        }));
    };

    const selectedInterviewersDetails = availableInterviewers.filter((i) =>
        formData.interviewerIds.includes(i.clerkId)
    );

    const stillAvailableInterviewers = availableInterviewers.filter(
        (i) => !formData.interviewerIds.includes(i.clerkId)
    );

    if (roleLoading) return <LoaderUI />;

    return (
        <div className="container max-w-7xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                {/* HEADER INFO */}
                <div>
                    <h1 className="text-3xl font-bold">Interviews</h1>
                    <p className="text-muted-foreground mt-1">
                        Schedule and manage interviews
                    </p>
                </div>

                <Dialog
                    open={isSchedulingDialogOpen}
                    onOpenChange={setIsSchedulingDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            onClick={() => setIsSchedulingDialogOpen(true)}
                        >
                            Schedule Interview
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
                        <DialogHeader>
                            <DialogTitle>Schedule Interview</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {/* INTERVIEW TITLE */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Title
                                </label>
                                <Input
                                    placeholder="E.g., Technical Screen, Behavioral Round"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* INTERVIEW DESC */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Description (Optional)
                                </label>
                                <Textarea
                                    placeholder="Any additional details for the interview"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={3}
                                />
                            </div>

                            {/* CANDIDATE */}
                            {!isCandidate && ( // Show candidate selection only if scheduler is NOT a candidate
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Candidate
                                    </label>
                                    <Select
                                        value={formData.candidateId}
                                        onValueChange={(candidateId) =>
                                            setFormData({
                                                ...formData,
                                                candidateId,
                                            })
                                        }
                                        disabled={isCandidate}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select candidate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableCandidates.map((c) => (
                                                <SelectItem
                                                    key={c.clerkId}
                                                    value={c.clerkId}
                                                >
                                                    <UserInfo user={c} />
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {isCandidate && user && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Candidate
                                    </label>
                                    <div className="p-2 border rounded-md bg-muted">
                                        <UserInfo
                                            user={
                                                allUsers.find(
                                                    (u) => u.clerkId === user.id
                                                )!
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            {/* INTERVIEWERS */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Interviewers (Optional for candidates)
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedInterviewersDetails.map(
                                        (interviewer) => (
                                            <div
                                                key={interviewer.clerkId}
                                                className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                                            >
                                                <UserInfo user={interviewer} />

                                                {!(
                                                    isInterviewer &&
                                                    user?.id ===
                                                        interviewer.clerkId &&
                                                    formData.interviewerIds
                                                        .length === 1
                                                ) && (
                                                    <button
                                                        onClick={() =>
                                                            removeInterviewer(
                                                                interviewer.clerkId
                                                            )
                                                        }
                                                        className="hover:text-destructive transition-colors"
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                                {stillAvailableInterviewers.length > 0 && (
                                    <Select
                                        onValueChange={addInterviewer}
                                        value=""
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Add interviewer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stillAvailableInterviewers.map(
                                                (interviewer) => (
                                                    <SelectItem
                                                        key={
                                                            interviewer.clerkId
                                                        }
                                                        value={
                                                            interviewer.clerkId
                                                        }
                                                    >
                                                        <UserInfo
                                                            user={interviewer}
                                                        />
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                                {stillAvailableInterviewers.length === 0 &&
                                    selectedInterviewersDetails.length ===
                                        0 && (
                                        <p className="text-xs text-muted-foreground">
                                            No interviewers available to add.
                                        </p>
                                    )}
                            </div>

                            {/* DATE & TIME */}
                            <div className="flex gap-4">
                                {/* CALENDAR */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Date
                                    </label>
                                    <Calendar
                                        mode="single"
                                        selected={formData.date}
                                        onSelect={(date) =>
                                            date &&
                                            setFormData({ ...formData, date })
                                        }
                                        disabled={(date) =>
                                            date <
                                            new Date(
                                                new Date().setHours(0, 0, 0, 0)
                                            )
                                        }
                                        className="rounded-md border"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Time
                                    </label>
                                    <Select
                                        value={formData.time}
                                        onValueChange={(time) =>
                                            setFormData({ ...formData, time })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIME_SLOTS.map((time) => (
                                                <SelectItem
                                                    key={time}
                                                    value={time}
                                                >
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setIsSchedulingDialogOpen(false)
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={scheduleMeeting}
                                    disabled={isCreating}
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2Icon className="mr-2 size-4 animate-spin" />
                                            Scheduling...
                                        </>
                                    ) : (
                                        "Schedule Interview"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Display existing interviews */}
            {!existingInterviews ? (
                <div className="flex justify-center py-12">
                    <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
                </div>
            ) : existingInterviews.length > 0 ? (
                <div className="spacey-4">
                    <h2 className="text-2xl font-semibold mb-4">
                        Scheduled Interviews
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {existingInterviews.map((interview) => (
                            <MeetingCard
                                key={interview._id}
                                interview={interview}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    No interviews scheduled yet.
                </div>
            )}
        </div>
    );
}
export default InterviewScheduleUI;
