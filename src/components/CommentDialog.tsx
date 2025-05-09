"use client";

import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquareIcon, StarIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { getInterviewerInfo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface CommentDialogProps {
    interviewId: Id<"interviews">;
}

function CommentDialog({ interviewId }: CommentDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState("3");

    const addCommentMutation = useMutation(api.comments.addComment);
    const allUsers = useQuery(api.users.getUsers);
    const existingComments = useQuery(api.comments.getComments, {
        interviewId,
    });

    const handleSubmit = async () => {
        if (!comment.trim()) {
            toast.error("Please enter your comment.");
            return;
        }
        if (parseInt(rating) < 1 || parseInt(rating) > 5) {
            toast.error("Please select a rating between 1 and 5.");
            return;
        }

        try {
            await addCommentMutation({
                interviewId,
                content: comment.trim(),
                rating: parseInt(rating),
            });

            toast.success("Comment submitted");
            setComment("");
            setRating("3");
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to submit comment:", error);
            toast.error("Failed to submit comment");
        }
    };

    const renderStars = (ratingValue: number) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    className={`h-4 w-4 ${
                        star <= ratingValue
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                    }`}
                />
            ))}
        </div>
    );

    if (existingComments === undefined || allUsers === undefined) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* TRIGGER BUTTON */}
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                    <MessageSquareIcon className="h-4 w-4 mr-2" />
                    Add Review
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Interview Review</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
                    {existingComments.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">
                                    Previous Reviews
                                </h4>
                                <Badge variant="outline">
                                    {existingComments.length} Review
                                    {existingComments.length !== 1 ? "s" : ""}
                                </Badge>
                            </div>

                            <ScrollArea className="h-[200px] border rounded-md">
                                <div className="space-y-3 p-3">
                                    {existingComments.map((c) => {
                                        const commenterInfo =
                                            getInterviewerInfo(
                                                allUsers,
                                                c.interviewerId
                                            );

                                        return (
                                            <div
                                                key={c._id}
                                                className="rounded-lg border bg-card p-3 space-y-2 shadow-sm"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage
                                                                src={
                                                                    commenterInfo.image
                                                                }
                                                                alt={
                                                                    commenterInfo.name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {
                                                                    commenterInfo.initials
                                                                }
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {
                                                                    commenterInfo.name
                                                                }
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {format(
                                                                    c._creationTime,
                                                                    "MMM d, yyyy • h:mm a"
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {renderStars(c.rating)}
                                                </div>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {c.content}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    <div className="space-y-4 pt-2 border-t">
                        <div className="space-y-2">
                            <Label>Rating</Label>
                            <Select value={rating} onValueChange={setRating}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <SelectItem
                                            key={value}
                                            value={value.toString()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {renderStars(value)}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* COMMENT */}
                        <div className="space-y-2">
                            <Label>Your Comment</Label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts and feedback..."
                                className="h-28"
                                rows={4}
                            />
                        </div>
                    </div>
                </div>

                {/* BUTTONS */}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsOpen(false);
                            setComment("");
                            setRating("3");
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default CommentDialog;
