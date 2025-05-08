import { Button } from "@/components/ui/button";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";

export default function Home() {
    return (
        <div className="m-10">
            <SignInButton>
                <Button>Sign in</Button>
            </SignInButton>
        </div>
    );
}
