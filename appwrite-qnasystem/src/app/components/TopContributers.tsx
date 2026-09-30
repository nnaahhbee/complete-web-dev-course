// Combines CSS class names to style the contributor cards.
import { cn } from "@/lib/utils";

// Animates the list as contributor cards appear.
import { AnimatedList } from "@/components/ui/animated-list";
// Provides server-side access to user records.
import { users } from "@/models/server/config";
// Supplies user data types and options for database requests.
import { Models, Query } from "node-appwrite";
// Describes the extra user profile fields, such as reputation.
import { UserPrefs } from "@/store/Auth";
// Formats update dates as readable relative times.
import convertDateToRelativeTime from "@/utils/relativeTime";
// Creates a default avatar image from a user's initials.
import { avatars } from "@/models/client/config";

// Show one contributor's avatar, name, recent activity, and reputation.
const Notification = ({ user }: { user: Models.User<UserPrefs> }) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-100 transform cursor-pointer overflow-hidden rounded-2xl p-4",
                // animation styles
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                // light styles
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                // dark styles
                "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <picture>
                    {/* Use the user's initials to create their profile avatar. */}
                    <img
                        src={avatars.getInitials(user.name, 40, 40)}
                        alt={user.name}
                        className="rounded-2xl"
                    />
                </picture>
                <div className="flex flex-col overflow-hidden">
                    {/* Show the contributor's name and when their profile was updated. */}
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
                        <span className="text-sm sm:text-lg">{user.name}</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">
                            {convertDateToRelativeTime(new Date(user.$updatedAt))}
                        </span>
                    </figcaption>
                    {/* Display the user's reputation score. */}
                    <p className="text-sm font-normal dark:text-white/60">
                        <span>Reputation</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">{user.prefs.reputation}</span>
                    </p>
                </div>
            </div>
        </figure>
    );
};

// Load a small group of users and show them in an animated contributor list.
export default async function TopContributers() {
    // Request up to ten user records to display in the contributor panel.
    const topUsers = await users.list<UserPrefs>([Query.limit(10)]);

    // Render each user as a notification-style card inside the animated list.
    return (
        <div className="bg-background relative flex max-h-100 min-h-100 w-full max-w-lg flex-col overflow-hidden rounded-lg p-6 shadow-lg">
            <AnimatedList>
                {topUsers.users.map(user => (
                    <Notification user={user} key={user.$id} />
                ))}
            </AnimatedList>
        </div>
    );
}