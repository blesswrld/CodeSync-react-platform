"use client";

import LoaderUI from "@/components/LoaderUI";
import RecordingCard from "@/components/RecordingCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetCalls from "@/hooks/useGetCalls";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
// Шаг 1: Импортируем все необходимое из framer-motion
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

function RecordingsPage() {
    const { calls, isLoading } = useGetCalls();
    const [recordings, setRecordings] = useState<CallRecording[]>([]);

    // Шаг 2: Создаем motion value для анимации числа. Начинаем с 0.
    const count = useMotionValue(0);
    // Шаг 3: Создаем производное motion value, которое будет округлять анимированное число.
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
        const fetchRecordings = async () => {
            if (!calls) return;

            try {
                // Get recordings for each call
                const callData = await Promise.all(
                    calls.map((call) => call.queryRecordings())
                );

                const allRecordings = callData.flatMap(
                    (call) => call.recordings
                );

                setRecordings(allRecordings);
            } catch (error) {
                console.log("Error fetching recordings:", error);
            }
        };

        fetchRecordings();
    }, [calls]);

    // Шаг 4: Создаем useEffect, который будет запускать анимацию,
    // когда количество записей изменится.
    useEffect(() => {
        const controls = animate(count, recordings.length, {
            duration: 1.5,
            ease: "easeInOut",
        });

        // Функция очистки для остановки анимации, если компонент размонтируется
        return controls.stop;
    }, [recordings.length]); // Зависимость от длины массива записей

    if (isLoading) return <LoaderUI />;

    return (
        <div className="container max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold">Recordings</h1>
            <p className="text-muted-foreground my-1">
                {/* Шаг 5: Заменяем статическое число на анимированный компонент */}
                <motion.span>{rounded}</motion.span>{" "}
                {recordings.length === 1 ? "recording" : "recordings"} available
            </p>

            <ScrollArea className="h-[calc(100vh-12rem)] mt-3">
                {recordings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
                        {recordings.map((r) => (
                            <RecordingCard key={r.end_time} recording={r} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                        <p className="text-xl font-medium text-muted-foreground">
                            No recordings available
                        </p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

export default RecordingsPage;
