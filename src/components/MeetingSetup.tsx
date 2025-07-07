import {
    DeviceSettings,
    useCall,
    VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { CameraIcon, MicIcon, SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
// import toast from "react-hot-toast";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
    const [isCameraDisabled, setIsCameraDisabled] = useState(true);
    const [isMicDisabled, setIsMicDisabled] = useState(false);

    const call = useCall();

    if (!call) return null;

    useEffect(() => {
        if (isCameraDisabled) call.camera.disable();
        else call.camera.enable();
    }, [isCameraDisabled, call.camera]);

    useEffect(() => {
        if (isMicDisabled) call.microphone.disable();
        else call.microphone.enable();
    }, [isMicDisabled, call.microphone]);

    const handleJoin = async () => {
        await call.join();
        onSetupComplete();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background/95 animate-in fade-in duration-500">
            <div className="w-full max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="md:col-span-1 p-6 flex flex-col animate-in slide-in-from-left-8 duration-500 ease-out">
                        <div>
                            <h1 className="text-xl font-semibold mb-1">
                                Camera Preview
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Make sure you look good!
                            </p>
                        </div>

                        <div className="mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative transition-shadow duration-300 hover:shadow-lg">
                            <div className="absolute inset-0">
                                <VideoPreview className="h-full w-full" />
                            </div>
                        </div>
                    </Card>

                    <Card className="md:col-span-1 p-6 animate-in slide-in-from-right-8 duration-500 ease-out delay-150">
                        <div className="h-full flex flex-col">
                            <div>
                                <h2 className="text-xl font-semibold mb-1">
                                    Meeting Details
                                </h2>
                                <p className="text-sm text-muted-foreground break-all">
                                    {call.id}
                                </p>
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="space-y-6 mt-8">
                                    <div className="flex items-center justify-between animate-in fade-in duration-300 delay-200">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-200 group hover:scale-110">
                                                <CameraIcon className="h-5 w-5 text-primary transition-transform duration-200 group-hover:rotate-6" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    Camera
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {isCameraDisabled
                                                        ? "Off"
                                                        : "On"}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={!isCameraDisabled}
                                            onCheckedChange={(checked) =>
                                                setIsCameraDisabled(!checked)
                                            }
                                            className="data-[state=checked]:bg-primary transition-colors duration-200"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between animate-in fade-in duration-300 delay-250">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-200 group hover:scale-110">
                                                <MicIcon className="h-5 w-5 text-primary transition-transform duration-200 group-hover:rotate-6" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    Microphone
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {isMicDisabled
                                                        ? "Off"
                                                        : "On"}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={!isMicDisabled}
                                            onCheckedChange={(checked) =>
                                                setIsMicDisabled(!checked)
                                            }
                                            className="data-[state=checked]:bg-primary transition-colors duration-200"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between animate-in fade-in duration-300 delay-300">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-200 group hover:scale-110">
                                                <SettingsIcon className="h-5 w-5 text-primary transition-transform duration-200 group-hover:rotate-6" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    Settings
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Configure devices
                                                </p>
                                            </div>
                                        </div>
                                        <DeviceSettings />
                                    </div>
                                </div>

                                <div className="space-y-3 mt-8 animate-in fade-in duration-300 delay-350">
                                    <Button
                                        className="w-full transition-transform duration-200 ease-out hover:scale-105"
                                        size="lg"
                                        onClick={handleJoin}
                                    >
                                        Join Meeting
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground animate-in fade-in duration-300 delay-400">
                                        You can share the meeting link with your
                                        friends or colleagues. 🎉
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default MeetingSetup;
