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

// Хук для отслеживания ширины окна
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
    const isMobileScreen = useIsMobileScreen(900); // true если ширина <= 900px

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

    const videoPanelDesktopSize = 35;
    const codingPanelDesktopSize = 65;

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
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                        <div className="flex items-center gap-2 rounded-full bg-background/80 p-2 shadow-lg backdrop-blur-sm">
                            <CallControls onLeave={() => router.push("/")} />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <LayoutListIcon className="size-5" />
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
                                className="rounded-full"
                                onClick={() =>
                                    setShowParticipants(!showParticipants)
                                }
                            >
                                <UsersIcon className="size-5" />
                            </Button>
                            <EndCallButton />
                        </div>
                    </div>
                </ResizablePanel>

                {/* Условно рендерим ResizableHandle и панель с CodeEditor */}
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
