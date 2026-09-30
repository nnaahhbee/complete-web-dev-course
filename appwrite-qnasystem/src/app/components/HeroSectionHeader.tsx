"use client";

// Displays a rotating cloud of technology icons.
import {IconCloud} from "@/components/ui/icon-cloud";
// Adds the animated particles behind the hero content.
import {Particles} from "@/components/ui/particles";
// Styles the main call-to-action buttons with a shimmer animation.
import {ShimmerButton} from "@/components/ui/shimmer-button";
// Provides the current sign-in session to choose which actions to show.
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import React from "react";

// Icon names used to build image URLs for the technology cloud.
const slugs = [
    "typescript",
    "javascript",
    "dart",
    "java",
    "react",
    "flutter",
    "android",
    "html5",
    "css3",
    "nodedotjs",
    "express",
    "nextdotjs",
    "prisma",
    "amazonaws",
    "postgresql",
    "firebase",
    "nginx",
    "vercel",
    "testinglibrary",
    "jest",
    "cypress",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "sonarqube",
    "figma",
];

const HeroSectionHeader = () => {
    // Check whether a user is signed in before showing the hero actions.
    const { session } = useAuthStore();

    // Arrange the animated background, welcome message, buttons, and technology icons.
    return (
        <div className="container mx-auto px-4">
            {/* Fill the screen with decorative animated particles. */}
            <Particles
                className="fixed inset-0 h-full w-full"
                quantity={500}
                ease={100}
                color="#ffffff"
                refresh
            />
            <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center justify-center">
                    <div className="space-y-4 text-center">
                        {/* Introduce the site with its name and a short description. */}
                        <h1 className="pointer-events-none z-10 whitespace-pre-wrap bg-linear-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
                            RiverFlow
                        </h1>
                        <p className="text-center text-xl font-bold leading-none tracking-tighter">
                            Ask questions, share knowledge, and collaborate with developers
                            worldwide. Join our community and enhance your coding skills!
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            {/* Signed-in users can go straight to the question form. */}
                            {session ? (
                                <Link href="/questions/ask">
                                    <ShimmerButton className="shadow-2xl">
                                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                            Ask a question
                                        </span>
                                    </ShimmerButton>
                                </Link>
                            ) : (
                                /* Visitors can register or sign in to their account. */
                                <>
                                    <Link href="/register">
                                        <ShimmerButton className="shadow-2xl">
                                            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                                Sign up
                                            </span>
                                        </ShimmerButton>
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="relative rounded-full border border-neutral-200 px-8 py-3 font-medium text-black dark:border-white/20 dark:text-white"
                                    >
                                        <span>Login</span>
                                        <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-linear-to-r from-transparent via-blue-500 to-transparent" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="relative max-w-lg overflow-hidden">
                        {/* Turn each technology name into an icon image URL. */}
                        <IconCloud images={slugs.map(slug => `https://cdn.simpleicons.org/${slug}`)}
/>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Make this hero header available to the page that displays it.
export default HeroSectionHeader;