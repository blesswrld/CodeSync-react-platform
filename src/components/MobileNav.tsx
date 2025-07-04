"use client";

import { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ModeToggle } from "./ModeToggle";
import DashboardBtn from "./DashboardBtn";
import { UserButton } from "@clerk/nextjs";

// --- Анимационные варианты (variants) ---
const sidebarVariants: Variants = {
    open: {
        clipPath: `circle(1200px at calc(100% - 48px) 40px)`,
        transition: { type: "spring", stiffness: 40, restDelta: 2 },
    },
    closed: {
        clipPath: "circle(24px at calc(100% - 48px) 40px)",
        transition: { delay: 0.3, type: "spring", stiffness: 400, damping: 40 },
    },
};

const navVariants: Variants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
};

const itemVariants: Variants = {
    open: {
        x: 0,
        opacity: 1,
        transition: { x: { stiffness: 1000, velocity: -100 } },
    },
    closed: { x: 50, opacity: 0, transition: { x: { stiffness: 1000 } } },
};
// --- Компоненты ---
const Path = (props: any) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="hsl(var(--foreground))"
        strokeLinecap="round"
        {...props}
    />
);

const MenuToggle = ({
    toggle,
    isOpen,
}: {
    toggle: () => void;
    isOpen: boolean;
}) => (
    <button
        onClick={toggle}
        className="w-full h-full bg-transparent border-none cursor-pointer outline-none flex items-center justify-center"
    >
        {/* Оборачиваем SVG в motion.div, чтобы управлять анимацией */}
        <motion.div animate={isOpen ? "open" : "closed"}>
            <svg width="23" height="23" viewBox="0 0 23 23">
                <Path
                    variants={{
                        closed: { d: "M 2 2.5 L 20 2.5" },
                        open: { d: "M 3 16.5 L 17 2.5" },
                    }}
                    transition={{ duration: 0.3 }}
                />
                <Path
                    d="M 2 9.423 L 20 9.423"
                    variants={{
                        closed: { opacity: 1 },
                        open: { opacity: 0 },
                    }}
                    transition={{ duration: 0.1 }}
                />
                <Path
                    variants={{
                        closed: { d: "M 2 16.346 L 20 16.346" },
                        open: { d: "M 3 2.5 L 17 16.346" },
                    }}
                    transition={{ duration: 0.3 }}
                />
            </svg>
        </motion.div>
    </button>
);

const Navigation = ({ closeMenu }: { closeMenu: () => void }) => (
    <motion.div
        variants={navVariants}
        className="mobile-nav-menu items-center absolute top-24 right-0 w-full px-8 flex flex-col z-[60]"
    >
        <motion.div variants={itemVariants} className="mb-5">
            <div className="w-[60px] h-[60px]">
                <UserButton afterSignOutUrl="/" />
            </div>
        </motion.div>

        <motion.div
            variants={itemVariants}
            className="mb-5"
            onClick={closeMenu}
        >
            <div className="w-[200px] h-[50px]">
                <ModeToggle isMobile={true} />
            </div>
        </motion.div>

        <motion.div
            variants={itemVariants}
            className="mb-5"
            onClick={closeMenu}
        >
            <div className="w-[200px] h-[50px]">
                <DashboardBtn isMobile={true} />
            </div>
        </motion.div>
    </motion.div>
);

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMenu}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>

            <div className="fixed top-4 right-4 w-12 h-12 z-[60]">
                {/* Передаем состояние isOpen в MenuToggle */}
                <MenuToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
            </div>

            <motion.nav
                initial={false}
                animate={isOpen ? "open" : "closed"}
                className={`fixed top-0 right-0 bottom-0 w-[300px] z-50 ${!isOpen && "pointer-events-none"}`}
            >
                <motion.div
                    className="absolute top-0 right-0 bottom-0 w-[300px] bg-background border-l"
                    variants={sidebarVariants}
                />
                {isOpen && <Navigation closeMenu={closeMenu} />}
            </motion.nav>
        </>
    );
}
