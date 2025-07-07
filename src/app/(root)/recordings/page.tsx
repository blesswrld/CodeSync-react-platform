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
    const [recordings, setRecordings] = useState([]);

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
    }, [recordings.length]);

    if (isLoading) return ;

    return (
        
            {/* HEADER SECTION */}
            
Recordings
            
                {/* Шаг 5: Заменяем статическое число на анимированный компонент */}
                {rounded}{" "}
                {recordings.length === 1 ? "recording" : "recordings"} available
            

            {/* RECORDINGS GRID */}
            
                {recordings.length > 0 ? (
                    
                        {/* Возвращаем простой рендер карточек без логики удаления */}
                        {recordings.map((r) => (
                             {}}
                            />
                        ))}
                    
                ) : (
                    
                        
                            No recordings available
                        
                    
                )}
            
        
    );
}

export default RecordingsPage;
