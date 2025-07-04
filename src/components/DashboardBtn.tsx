"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { SparkleIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { motion } from "framer-motion"; // Импортируем motion

function DashboardBtn({ isMobile = false }: { isMobile?: boolean }) {
    const { isLoading, isInterviewer, isCandidate } = useUserRole();

    if (isLoading) {
        return null;
    }

    if (!isInterviewer && !isCandidate) {
        return null;
    }

    return (
        // Оборачиваем Link в motion.div для анимации
        <motion.div
            whileHover={{ scale: 1.05 }} // Увеличиваем при наведении
            whileTap={{ scale: 0.95 }} // Уменьшаем при клике
            transition={{ type: "spring", stiffness: 400, damping: 17 }} // Плавная пружинная анимация
            // Если isMobile, то motion.div тоже растягивается
            className={isMobile ? "w-full h-full" : ""}
        >
            <Link href={"/dashboard"}>
                <Button
                    // Если isMobile, добавляем w-full h-full, чтобы кнопка заняла все место
                    className={`gap-2 font-medium ${isMobile ? "w-full h-full" : ""}`}
                    // Если isMobile, убираем фиксированный размер
                    size={isMobile ? undefined : "sm"}
                >
                    <SparkleIcon className="size-4" />
                    Dashboard
                </Button>
            </Link>
        </motion.div>
    );
}

export default DashboardBtn;
