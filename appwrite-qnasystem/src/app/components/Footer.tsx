import React from "react";
// Adds a decorative animated grid behind the footer content.
import {AnimatedGridPattern }from "@/components/ui/animated-grid-pattern";
// Combines CSS class names for the grid's appearance.
import { cn } from "cn";
// Creates links that navigate between pages in the app.
import Link from "next/link";

// Shared footer shown at the bottom of the site.
const Footer = () => {
    // Keep the footer's page links together so they can be rendered from one list.
    const items = [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "About",
            href: "/about",
        },
        {
            title: "Privacy Policy",
            href: "/privacy-policy",
        },
        {
            title: "Terms of Service",
            href: "/terms-of-service",
        },
        {
            title: "Questions",
            href: "/questions",
        },
    ];

    // Render the navigation links, copyright year, and animated background.
    return (
        <footer className="relative block overflow-hidden border-t border-solid border-white/30 py-20">
            <div className="container mx-auto px-4">
                <ul className="flex flex-wrap items-center justify-center gap-3">
                    {/* Create one footer link for each item in the navigation list. */}
                    {items.map(item => (
                        <li key={item.href}>
                            <Link href={item.href}>{item.title}</Link>
                        </li>
                    ))}
                </ul>
                {/* Use the current year so the copyright notice stays up to date. */}
                <div className="mt-4 text-center">&copy; {new Date().getFullYear()} Riverpod</div>
            </div>
            {/* Add a subtle animated grid and style its position and shape. */}
            <AnimatedGridPattern
                numSquares={30}
                maxOpacity={0.4}
                duration={3}
                repeatDelay={1}
                className={cn(
                    "mask-[radial-gradient(3000px_circle_at_center,white,transparent)]",
                    "inset-y-[-50%] h-[200%] skew-y-6"
                )}
            />
        </footer>
    );
};

// Make the footer available to the rest of the app.
export default Footer;