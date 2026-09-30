"use client";

// Link lets users move between profile sections without a full page reload.
import Link from "next/link";
// These hooks provide the current profile's route details and the active URL.
import { useParams, usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
    // Read the profile ID and slug so each navigation link points to this user's page.
    const { userId, userSlug } = useParams();
    // Check the current URL to highlight the section the user is viewing.
    const pathname = usePathname();

    // Define the sections available in the user's profile navigation.
    const items = [
        {
            name: "Summary",
            href: `/users/${userId}/${userSlug}`,
        },
        {
            name: "Questions",
            href: `/users/${userId}/${userSlug}/questions`,
        },
        {
            name: "Answers",
            href: `/users/${userId}/${userSlug}/answers`,
        },
        {
            name: "Votes",
            href: `/users/${userId}/${userSlug}/votes`,
        },
    ];

    // Turn each section into a link and visually mark the link for the current page.
    return (
        <ul className="flex w-full shrink-0 gap-1 overflow-auto sm:w-40 sm:flex-col">
            {items.map(item => (
                <li key={item.name}>
                    {/* Highlight the current section and add a hover effect to the others. */}
                    <Link
                        href={item.href}
                        className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                            pathname === item.href ? "bg-white/20" : "hover:bg-white/20"
                        }`}
                    >
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

// Make this navigation component available to the profile layout.
export default Navbar;