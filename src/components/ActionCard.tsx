import { QuickActionType } from "../app/constants/index";
import { Card } from "./ui/card";
// Импорт motion для анимаций
import { motion } from "motion/react";

// some weird tw bug, but this is how it works
// from-orange-500/10 via-orange-500/5 to-transparent
// from-blue-500/10 via-blue-500/5 to-transparent
// from-purple-500/10 via-purple-500/5 to-transparent
// from-primary/10 via-primary/5 to-transparent

const MotionCard = motion(Card);

const cardVariants = {
    // Состояние по умолчанию
    initial: {
        y: 0,
        scale: 1,
        boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
    // Состояние при наведении курсора
    hover: {
        y: -4,
        scale: 1.03,
        boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
};

function ActionCard({
    action,
    onClick,
}: {
    action: QuickActionType;
    onClick: () => void;
}) {
    return (
        <MotionCard
            // Применяем наши варианты анимации
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            // Добавляем анимацию нажатия, как в вашем примере
            whileTap={{ scale: 0.98, y: -2 }}
            // Задаем физику анимации один раз
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-100 group-hover:opacity-50 transition-opacity`}
            />

            <div className="relative p-6 size-full">
                <div className="space-y-3">
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center bg-${action.color}/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                    >
                        <action.icon
                            className={`h-6 w-6 text-${action.color}`}
                        />
                    </div>

                    <div className="space-y-1">
                        <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                            {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {action.description}
                        </p>
                    </div>
                </div>
            </div>
        </MotionCard>
    );
}

export default ActionCard;
