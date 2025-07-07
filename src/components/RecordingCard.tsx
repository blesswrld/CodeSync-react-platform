"use client";

import { CallRecording } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
// Шаг 1: Импортируем иконку корзины
import {
    CalendarIcon,
    ClockIcon,
    CopyIcon,
    PlayIcon,
    Trash2,
} from "lucide-react";
import { Button } from "./ui/button";

// Шаг 2: Обновляем тип пропсов, чтобы компонент принимал функцию onDelete
type RecordingCardProps = {
    recording: CallRecording;
    onDelete: (url: string) => void;
};

// Шаг 3: Обновляем параметры компонента
function RecordingCard({ recording, onDelete }: RecordingCardProps) {
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(recording.url);
            toast.success("Recording link copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy link to clipboard");
        }
    };

    // Шаг 4: Создаем обработчик для кнопки удаления
    const handleDeleteClick = (e: React.MouseEvent) => {
        // Останавливаем "всплытие" события, чтобы клик по корзине
        // не вызвал клик по всей карточке (который открывает видео)
        e.stopPropagation();
        onDelete(recording.url);
    };

    const formattedStartTime = recording.start_time
        ? format(new Date(recording.start_time), "MMM d, yyyy, hh:mm a")
        : "Unknown";

    const duration =
        recording.start_time && recording.end_time
            ? calculateRecordingDuration(
                  recording.start_time,
                  recording.end_time
              )
            : "Unknown duration";

    return (
        // Шаг 5: Добавляем 'relative', чтобы позиционировать кнопку удаления
        <Card className="group relative hover:shadow-lg hover:-translate-y-0.5 transition-all">
            {/* CARD HEADER */}
            <CardHeader className="space-y-1">
                <div className="space-y-2">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span>{formattedStartTime}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                            <ClockIcon className="h-3.5 w-3.5" />
                            <span>{duration}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            {/* CARD CONTENT */}
            {/* The video preview area and play button already have transition-colors on hover */}
            <CardContent>
                <div
                    className="w-full aspect-video bg-muted/50 rounded-lg flex items-center justify-center cursor-pointer group"
                    onClick={() => window.open(recording.url, "_blank")}
                >
                    <div className="size-12 rounded-full bg-background/90 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <PlayIcon className="size-6 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                <Button
                    className="flex-1"
                    onClick={() => window.open(recording.url, "_blank")}
                >
                    <PlayIcon className="size-4 mr-2" />
                    Play Recording
                </Button>
                <Button variant="secondary" onClick={handleCopyLink}>
                    <CopyIcon className="size-4" />
                </Button>
            </CardFooter>

            {/* Шаг 6: Добавляем саму кнопку удаления */}
            <div className="absolute top-3 right-3">
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleDeleteClick}
                    className="size-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete recording"
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>
        </Card>
    );
}
export default RecordingCard;
