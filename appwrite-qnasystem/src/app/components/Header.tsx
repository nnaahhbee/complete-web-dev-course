"use client";
// React and these hooks let the header show navigation based on the signed-in user.
import React from "react";
// Renders the site's floating navigation bar.
import { FloatingNav } from "@/components/ui/floating-navbar";
// Icons used to identify the navigation destinations.
import { IconHome, IconMessage, IconWorldQuestion } from "@tabler/icons-react";
// Provides the current user's information from the shared authentication store.
import { useAuthStore } from "@/store/Auth";
// Turns a user's name into URL-friendly text for their profile link.
import slugify from "slugify";

export default function Header() {
    // Read the current user; this is empty when nobody is signed in.
    const { user } = useAuthStore();

    // Set up navigation links that are available to every visitor.
    const navItems = [
        {
            name: "Home",
            link: "/",
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "Questions",
            link: "/questions",
            icon: <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
    ];

    // Add a profile link only when a user is signed in.
    if (user)
        navItems.push({
            name: "Profile",
            link: `/users/${user.$id}/${slugify(user.name)}`,
            icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
        });

    // Pass the completed list of links to the floating navigation component.
    return (
        <div className="relative w-full">
            <FloatingNav navItems={navItems} />
        </div>
    );
}