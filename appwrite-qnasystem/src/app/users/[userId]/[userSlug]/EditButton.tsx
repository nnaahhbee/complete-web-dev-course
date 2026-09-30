"use client";

// Read the signed-in user's information from the shared authentication store.
import { useAuthStore } from "@/store/Auth";
// Use Next.js components and hooks to build a route from the current page parameters.
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const EditButton = () => {
    // Get the profile's ID and URL-friendly name from the current route.
    const { userId, userSlug } = useParams();
    // Get the currently signed-in user so the button can be restricted to the profile owner.
    const { user } = useAuthStore();

    // Hide the edit link when the signed-in user does not own this profile.
    if (user?.$id !== userId) return null;

    // Send the profile owner to the edit page when they select the button.
    return (
        <Link
            href={`/users/${userId}/${userSlug}/edit`}
            className="relative rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-black dark:border-white/20 dark:text-white"
        >
            <span>Edit</span>
            {/* Decorative blue underline shown beneath the edit link. */}
            <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-linear-to-r from-transparent via-blue-500 to-transparent" />
        </Link>
    );
};

// Make this button available to the profile layout.
export default EditButton;