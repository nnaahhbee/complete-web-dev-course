// Provides the URL for creating a default avatar from a user's initials.
import { avatars } from "@/models/client/config";
// Lets this server-rendered layout load the profile user from the database.
import { users } from "@/models/server/config";
// Describes the user fields used by this page.
import { UserPrefs } from "@/store/Auth";
// Converts dates into readable text such as "two days ago."
import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";
// Shows an edit link when the signed-in user owns this profile.
import EditButton from "./EditButton";
// Provides links to the profile's different sections.
import Navbar from "./Navbar";
// Icons used beside the user's join date and last activity.
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";

// Shared layout for the profile page and its nested sections.
const Layout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ userId: string; userSlug: string }>;
}) => {
    const { userId } = await params;

    // Load this profile's user record using the ID from the route.
    const user = await users.get<UserPrefs>(userId);

    // Show the profile header, navigation, and the selected section's content.
    return (
        <div className="container mx-auto space-y-4 px-4 pb-20 pt-32">
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-40 shrink-0">
                    <picture className="block w-full">
                        {/* Generate an avatar image using the user's initials. */}
                        <img
                            src={avatars.getInitials(user.name, 200, 200)}
                            alt={user.name}
                            className="h-full w-full rounded-xl object-cover"
                        />
                    </picture>
                </div>
                <div className="w-full">
                    <div className="flex items-start justify-between">
                        <div className="block space-y-0.5">
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <p className="text-lg text-gray-500">{user.email}</p>
                            {/* Format the account creation date as relative time. */}
                            <p className="flex items-center gap-1 text-sm font-bold text-gray-500">
                                <IconUserFilled className="w-4 shrink-0" /> Dropped{" "}
                                {convertDateToRelativeTime(new Date(user.$createdAt))},
                            </p>
                            {/* Show when the user's profile was most recently updated. */}
                            <p className="flex items-center gap-1 text-sm text-gray-500">
                                <IconClockFilled className="w-4 shrink-0" /> Last activity&nbsp;
                                {convertDateToRelativeTime(new Date(user.$updatedAt))}
                            </p>
                        </div>
                        <div className="shrink-0">
                            <EditButton />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                <Navbar />
                {/* Render the nested profile page, such as Summary, Questions, or Answers. */}
                <div className="w-full">{children}</div>
            </div>
        </div>
    );
};

// Make this layout available to the profile route and its nested pages.
export default Layout;