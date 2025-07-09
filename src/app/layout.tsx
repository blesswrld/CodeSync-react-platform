import type { Metadata } from "next";
import localFont from "next/font/local";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import ConvexClerkProvider from "@/components/providers/ConvexClerkProvider";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "CodeSync | Платформа для созвонов - Live кодинга",
    description:
        "Проводите эффективные технические собеседования с CodeSync или просто созванивайтесь с коллегами - друзьями. Интегрированная среда для live-кодинга, запись сессий и удобный дашборд для управления кандидатами.",
    keywords:
        "codesync, созвон, live-кодинг, техническое собеседование, платформа, видеоконференция",
    authors: [{ name: "Гельгаев Тамерлан" }],
    robots: "index, follow",

    // Open Graph метатеги
    openGraph: {
        title: "CodeSync | Платформа для созвонов - Live кодинга",
        description:
            "Проводите эффективные технические собеседования с CodeSync или созванивайтесь с коллегами. Live-кодинг, запись сессий и дашборд для управления.",
        url: "https://codesync-react-platform.vercel.app",
        siteName: "CodeSync",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://codesync-react-platform.vercel.app/codesync-preview.jpg",
                width: 1200,
                height: 630,
                alt: "Превью CodeSync - платформа для созвонов и live-кодинга",
            },
        ],
    },

    // Twitter Card метатеги
    twitter: {
        card: "summary_large_image",
        title: "CodeSync | Платформа для созвонов - Live кодинга",
        description:
            "Проводите собеседования и созвоны с CodeSync. Live-кодинг, запись и управление кандидатами.",
        images: "https://codesync-react-platform.vercel.app/codesync-preview.jpg",
    },

    // Метатеги для мобильных устройств и тем
    themeColor: "#ffffff",
    colorScheme: "light dark",

    icons: {
        apple: [
            { url: "/favicon/apple-icon-57x57.png", sizes: "57x57" },
            { url: "/favicon/apple-icon-60x60.png", sizes: "60x60" },
            { url: "/favicon/apple-icon-72x72.png", sizes: "72x72" },
            { url: "/favicon/apple-icon-76x76.png", sizes: "76x76" },
            { url: "/favicon/apple-icon-114x114.png", sizes: "114x114" },
            { url: "/favicon/apple-icon-120x120.png", sizes: "120x120" },
            { url: "/favicon/apple-icon-144x144.png", sizes: "144x144" },
            { url: "/favicon/apple-icon-152x152.png", sizes: "152x152" },
            { url: "/favicon/apple-icon-180x180.png", sizes: "180x180" },
        ],
        icon: [
            {
                url: "/favicon/android-icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                url: "/favicon/favicon-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
            {
                url: "/favicon/favicon-96x96.png",
                sizes: "96x96",
                type: "image/png",
            },
            {
                url: "/favicon/favicon-16x16.png",
                sizes: "16x16",
                type: "image/png",
            },
        ],
    },
    other: {
        manifest: "/favicon/manifest.json",
        "msapplication-TileColor": "#ffffff",
        "msapplication-TileImage": "/favicon/ms-icon-144x144.png",
        "theme-color": "#ffffff",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <SignedIn>
                            <div className="min-h-screen">
                                <Navbar />
                                <main className="px-4 sm:px-6 lg:px-8">
                                    {children}
                                </main>
                            </div>
                        </SignedIn>

                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </ThemeProvider>
                    <Toaster />
                </body>
            </html>
        </ConvexClerkProvider>
    );
}
