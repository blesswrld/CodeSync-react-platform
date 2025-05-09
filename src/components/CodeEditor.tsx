"use client";

import { CODING_QUESTIONS, LANGUAGES } from "../app/constants/index";
import { useState } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";

function CodeEditor() {
    const [selectedQuestion, setSelectedQuestion] = useState(
        CODING_QUESTIONS[0]
    );
    const [language, setLanguage] = useState<"javascript" | "python" | "java">(
        LANGUAGES[0].id
    );
    const [code, setCode] = useState(selectedQuestion.starterCode[language]);

    const handleQuestionChange = (questionId: string) => {
        const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
        setSelectedQuestion(question);
        setCode(question.starterCode[language]);
    };

    const handleLanguageChange = (
        newLanguage: "javascript" | "python" | "java"
    ) => {
        setLanguage(newLanguage);
        setCode(selectedQuestion.starterCode[newLanguage]);
    };

    const questionSectionDefaultSize = 40;
    const codeEditorSectionDefaultSize = 60;

    return (
        <ResizablePanelGroup direction="vertical" className="h-full w-full">
            {/* QUESTION SECTION */}
            <ResizablePanel
                defaultSize={questionSectionDefaultSize}
                minSize={15}
            >
                <ScrollArea className="h-full">
                    <div className="p-4 md:p-6">
                        {" "}
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* HEADER */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                                        {selectedQuestion.title}
                                    </h2>
                                    <p className="text-xs md:text-sm text-muted-foreground">
                                        Choose your language and solve the
                                        problem
                                    </p>
                                </div>
                                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3">
                                    <Select
                                        value={selectedQuestion.id}
                                        onValueChange={handleQuestionChange}
                                    >
                                        <SelectTrigger className="w-full xs:w-[180px]">
                                            <SelectValue placeholder="Select question" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CODING_QUESTIONS.map((q) => (
                                                <SelectItem
                                                    key={q.id}
                                                    value={q.id}
                                                >
                                                    {q.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={language}
                                        onValueChange={handleLanguageChange}
                                    >
                                        <SelectTrigger className="w-full xs:w-[150px]">
                                            <SelectValue>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={`/${language}.png`}
                                                        alt={language}
                                                        className="w-4 h-4 md:w-5 md:h-5 object-contain"
                                                    />
                                                    {
                                                        LANGUAGES.find(
                                                            (l) =>
                                                                l.id ===
                                                                language
                                                        )?.name
                                                    }
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>

                                        <SelectContent>
                                            {LANGUAGES.map((lang) => (
                                                <SelectItem
                                                    key={lang.id}
                                                    value={lang.id}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={`/${lang.id}.png`}
                                                            alt={lang.name}
                                                            className="w-4 h-4 md:w-5 md:h-5 object-contain"
                                                        />
                                                        {lang.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* PROBLEM DESC. */}
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-2 py-3 px-4 md:py-4 md:px-6">
                                    <BookIcon className="h-4 w-4 md:h-5 md:w-5 text-primary/80" />
                                    <CardTitle className="text-base md:text-lg">
                                        Problem Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm leading-relaxed px-4 pb-4 md:px-6 md:pb-6">
                                    <div className="prose prose-xs md:prose-sm dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-line">
                                            {selectedQuestion.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* PROBLEM EXAMPLES */}
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-2 py-3 px-4 md:py-4 md:px-6">
                                    <LightbulbIcon className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                                    <CardTitle className="text-base md:text-lg">
                                        Examples
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                                    <div className="space-y-4">
                                        {selectedQuestion.examples.map(
                                            (example, index) => (
                                                <div
                                                    key={index}
                                                    className="space-y-2"
                                                >
                                                    <p className="font-medium text-xs md:text-sm">
                                                        Example {index + 1}:
                                                    </p>
                                                    <ScrollArea className="w-full rounded-md border">
                                                        <pre className="bg-muted/50 p-3 rounded-lg text-xs md:text-sm font-mono">
                                                            <div>
                                                                Input:{" "}
                                                                {example.input}
                                                            </div>
                                                            <div>
                                                                Output:{" "}
                                                                {example.output}
                                                            </div>
                                                            {example.explanation && (
                                                                <div className="pt-2 text-muted-foreground">
                                                                    Explanation:{" "}
                                                                    {
                                                                        example.explanation
                                                                    }
                                                                </div>
                                                            )}
                                                        </pre>
                                                        <ScrollBar orientation="horizontal" />
                                                    </ScrollArea>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* CONSTRAINTS */}
                            {selectedQuestion.constraints && (
                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-2 py-3 px-4 md:py-4 md:px-6">
                                        <AlertCircleIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                                        <CardTitle className="text-base md:text-lg">
                                            Constraints
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                                        <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                                            {selectedQuestion.constraints.map(
                                                (constraint, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-muted-foreground"
                                                    >
                                                        {constraint}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                    <ScrollBar />
                </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* CODE EDITOR */}
            <ResizablePanel
                defaultSize={codeEditorSectionDefaultSize}
                minSize={15}
            >
                <div className="h-full relative">
                    <Editor
                        height={"100%"}
                        defaultLanguage={language}
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 16,
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16, bottom: 16 },
                            wordWrap: "on",
                            wrappingIndent: "indent",
                        }}
                    />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
export default CodeEditor;
