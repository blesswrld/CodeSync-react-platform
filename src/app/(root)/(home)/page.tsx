"use client";

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "../../constants/index";
import { useUserRole } from "@/hooks/useUserRole";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion"; // Шаг 1: Импортируем motion
import { X } from "lucide-react";

export default function Home() {
    const router = useRouter();
    const { isLoading, isInterviewer } = useUserRole();
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"start" | "join">();

    // Шаг 2: Добавляем состояние для контроля видимости блока приветствия
    const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);

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
        // Шаг 3: Заменяем div на motion.div и применяем анимацию
        <motion.div
            className="container max-w-7xl mx-auto p-6"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Шаг 3: Оборачиваем анимируемый блок в AnimatePresence */}
            <AnimatePresence>
                {isWelcomeVisible && ( // Условие для рендера
                    // Шаг 4: Превращаем div в motion.div и добавляем анимации
                    <motion.div
                        key="welcome-banner" // AnimatePresence требует уникальный key для дочерних элементов
                        className="relative rounded-lg bg-card p-6 border shadow-sm mb-10"
                        initial={{ opacity: 0, y: -20, scale: 0.95 }} // Начальное состояние (при появлении)
                        animate={{ opacity: 1, y: 0, scale: 1 }} // Конечное состояние (когда на экране)
                        exit={{
                            opacity: 0,
                            y: -20,
                            height: 0,
                            padding: 0,
                            margin: 0,
                        }} // Анимация при скрытии
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            Welcome back!
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {isInterviewer
                                ? "Manage your interviews and review candidates effectively"
                                : "Access your upcoming interviews and preparations"}
                        </p>

                        {/* Шаг 5: Добавляем кнопку для скрытия блока */}
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-3 right-3"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsWelcomeVisible(false)}
                                className="size-8 rounded-full"
                            >
                                <X className="size-4" />
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Кнопка для возвращения блока, если нужно */}
            {/* {!isWelcomeVisible && (
                <div className="mb-10">
                    <Button onClick={() => setIsWelcomeVisible(true)}>
                        Show Welcome Message
                    </Button>
                </div>
            )} */}

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
