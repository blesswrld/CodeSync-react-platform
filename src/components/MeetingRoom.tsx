"use client";

import {
    CallControls,
    CallingState,
    CallParticipantsList,
    PaginatedGridLayout,
    SpeakerLayout,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { LayoutListIcon, LoaderIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "./ui/resizable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";
import toast from "react-hot-toast";
import CodeEditor from "./CodeEditor";

// Хук для отслеживания ширины окна (для общей компоновки панелей)
const useIsMobileScreen = (breakpoint = 900) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= breakpoint);
        };

        if (typeof window !== "undefined") {
            checkScreenSize();
            window.addEventListener("resize", checkScreenSize);
            return () => window.removeEventListener("resize", checkScreenSize);
        }
    }, [breakpoint]);

    return isMobile;
};

function MeetingRoom() {
    const router = useRouter();
    const isMobileScreen = useIsMobileScreen(900); // true если ширина <= 900px (для скрытия панели CodeEditor)

    const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
    const [showParticipants, setShowParticipants] = useState(false);
    const { useCallCallingState } = useCallStateHooks();

    const callingState = useCallCallingState();

    useEffect(() => {
        if (callingState === CallingState.LEFT) {
            toast.success("Left successfully");
            router.push("/");
        }
    }, [callingState, router]);

    const videoPanelDesktopSize = 35; // дефолтный размер для десктопа
    const codingPanelDesktopSize = 65; // дефолтный размер для десктопа

    if (callingState !== CallingState.JOINED) {
        return (
            <div className="h-screen flex items-center justify-center">
                <LoaderIcon className="size-10 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem-1px)]">
            <ResizablePanelGroup
                direction="horizontal"
                className="h-full w-full"
            >
                <ResizablePanel
                    defaultSize={isMobileScreen ? 100 : videoPanelDesktopSize}
                    minSize={isMobileScreen ? 100 : 20}
                    className="relative flex items-center justify-center"
                >
                    {/* VIDEO LAYOUT */}
                    <div className="absolute inset-0">
                        {layout === "grid" ? (
                            <PaginatedGridLayout />
                        ) : (
                            <SpeakerLayout />
                        )}
                        {showParticipants && (
                            <div className="absolute right-0 top-0 z-10 h-full w-[280px] md:w-[300px] bg-background/90 backdrop-blur-sm">
                                <CallParticipantsList
                                    onClose={() => setShowParticipants(false)}
                                />
                            </div>
                        )}
                    </div>

                    {/* VIDEO CONTROLS */}
                    <div className="absolute bottom-3 sm:bottom-4 left-2 right-2 md:left-1/2 md:-translate-x-1/2 z-20 flex justify-center px-1">
                        <div
                            className="flex flex-wrap items-center justify-center 
                                    gap-1 min-[380px]:gap-1.5 min-[460px]:gap-2 
                                    rounded-full bg-background/80 
                                    p-1.5 min-[460px]:p-2 
                                    shadow-lg backdrop-blur-sm 
                                    w-full max-w-md md:max-w-none md:w-auto"
                        >
                            <div className="min-w-0">
                                <CallControls
                                    onLeave={() => router.push("/")}
                                />
                            </div>
                            {/* Группа дополнительных кнопок */}
                            <div className="flex items-center gap-0.5 min-[380px]:gap-1 min-[460px]:gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 p-0"
                                        >
                                            <LayoutListIcon className="size-4 min-[460px]:size-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() => setLayout("grid")}
                                        >
                                            Grid View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setLayout("speaker")}
                                        >
                                            Speaker View
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full w-8 h-8 min-[460px]:w-9 min-[460px]:h-9 p-0"
                                    onClick={() =>
                                        setShowParticipants(!showParticipants)
                                    }
                                >
                                    <UsersIcon className="size-4 min-[460px]:size-5" />
                                </Button>

                                <EndCallButton />
                            </div>
                        </div>
                    </div>
                    {/* VIDEO CONTROLS */}
                </ResizablePanel>

                {!isMobileScreen && (
                    <>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            defaultSize={codingPanelDesktopSize}
                            minSize={1}
                        >
                            <CodeEditor />
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
        </div>
    );
}

export default MeetingRoom;
