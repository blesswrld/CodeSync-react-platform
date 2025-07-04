"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion"; // Импортируем motion

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle({ isMobile = false }: { isMobile?: boolean }) {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            {/* Оборачиваем триггер меню в motion.div */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1 }}
                // Если isMobile, то motion.div тоже растягивается
                className={isMobile ? "w-full h-full" : ""}
            >
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        // Если isMobile, добавляем w-full h-full
                        className={isMobile ? "w-full h-full" : ""}
                        // Если isMobile, убираем фиксированный размер "icon"
                        size={isMobile ? undefined : "icon"}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
            </motion.div>

            <DropdownMenuContent
                align="end"
                className="animate-in fade-in-10 zoom-in-95 duration-300"
            >
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
                >
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
                >
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
                >
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
