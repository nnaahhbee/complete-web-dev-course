// Provides server-side access to user profiles and database records.
import { databases, users } from "@/models/server/config";
// Describes the user profile fields used on this page.
import { UserPrefs } from "@/store/Auth";
import React from "react";
// Displays each profile statistic inside an animated card.
import { MagicCard } from "@/components/ui/magic-card";
// Animates the numbers as they appear on the page.
import {NumberTicker} from "@/components/ui/number-ticker";
// Names the database and collections that store questions and answers.
import { answerCollection, db, questionCollection } from "@/models/name";
// Builds filters for finding records created by this user.
import { Query } from "node-appwrite";

// Load the selected user's profile and activity statistics for the summary page.
const Page = async ({ params }: { params: { userId: string; userSlug: string } }) => {
    // Fetch the profile, question count, and answer count at the same time.
    const [user, questions, answers] = await Promise.all([
        users.get<UserPrefs>(params.userId),
        databases.listDocuments(db, questionCollection, [
            Query.equal("authorId", params.userId),
            // Ask for only one matching record; the database total still gives the full count.
            Query.limit(1), // for optimization
        ]),
        databases.listDocuments(db, answerCollection, [
            Query.equal("authorId", params.userId),
            // Ask for only one matching record; the database total still gives the full count.
            Query.limit(1), // for optimization
        ]),
    ]);

    // Display the user's reputation and activity counts in responsive statistic cards.
    return (
        <div className={"flex h-125 w-full flex-col gap-4 lg:h-62.5 lg:flex-row"}>
            {/* Show the user's reputation score. */}
            <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
                <div className="absolute inset-x-4 top-4">
                    <h2 className="text-xl font-medium">Reputation</h2>
                </div>
                <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
                    <NumberTicker value={user.prefs.reputation} />
                </p>
                {/* Add a soft decorative glow behind the score. */}
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </MagicCard>
            {/* Show how many questions this user has posted. */}
            <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
                <div className="absolute inset-x-4 top-4">
                    <h2 className="text-xl font-medium">Questions asked</h2>
                </div>
                <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
                    <NumberTicker value={questions.total} />
                </p>
                {/* Add a soft decorative glow behind the count. */}
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </MagicCard>
            {/* Show how many answers this user has posted. */}
            <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
                <div className="absolute inset-x-4 top-4">
                    <h2 className="text-xl font-medium">Answers given</h2>
                </div>
                <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
                    <NumberTicker value={answers.total} />
                </p>
                {/* Add a soft decorative glow behind the count. */}
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </MagicCard>
        </div>
    );
};

// Make this summary page available to the profile route.
export default Page;