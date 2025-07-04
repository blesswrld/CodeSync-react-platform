"use client";

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "../../constants/index";
import { useUserRole } from "@/hooks/useUserRole";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import { motion } from "framer-motion"; // Шаг 1: Импортируем motion

export default function Home() {
    const router = useRouter();
    const { isLoading, isInterviewer } = useUserRole();
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"start" | "join">();

    const handleQuickAction = (title: string) => {
        switch (title) {
            case "New Call":
                setModalType("start");
                setShowModal(true);
                break;
            case "Join Interview":
                setModalType("join");
                setShowModal(true);
                break;
            default:
                router.push(`/${title.toLowerCase().replace(" ", "-")}`);
        }
    };

    if (isLoading) return <LoaderUI />;

    return (
        // Шаг 2: Заменяем div на motion.div и применяем анимацию
        <motion.div
            className="container max-w-7xl mx-auto p-6"
            // Начальное состояние: невидимый и уменьшенный
            initial={{ opacity: 0, scale: 0.95 }}
            // Конечное состояние: полностью видимый и в нормальном размере
            animate={{ opacity: 1, scale: 1 }}
            // Настройки анимации, как в вашем примере
            transition={{
                duration: 1,
                ease: [0, 0.71, 0.2, 1.01],
            }}
        >
            <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    Welcome back!
                </h1>
                <p className="text-muted-foreground mt-2">
                    {isInterviewer
                        ? "Manage your interviews and review candidates effectively"
                        : "Access your upcoming interviews and preparations"}
                </p>
            </div>

            <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {QUICK_ACTIONS.map((action) => {
                        return (
                            <ActionCard
                                key={action.title}
                                action={action}
                                onClick={() => handleQuickAction(action.title)}
                            />
                        );
                    })}
                </div>

                <MeetingModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={
                        modalType === "join" ? "Join Meeting" : "Start Meeting"
                    }
                    isJoinMeeting={modalType === "join"}
                />
            </>
        </motion.div>
    );
}
