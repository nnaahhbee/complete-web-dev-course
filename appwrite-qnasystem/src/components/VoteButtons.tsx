"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { ID, Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

// A vote is an Appwrite document with a status describing whether it is an upvote or downvote.
type VoteDocument = Models.Document & {
    voteStatus: "upvoted" | "downvoted";
};

// Shows the current vote total and lets the user vote on a question or answer.
const VoteButtons = ({
    type,
    id,
    upvotes,
    downvotes,
    className,
}: {
    type: "question" | "answer";
    id: string;
    upvotes: Models.DocumentList<Models.Document>;
    downvotes: Models.DocumentList<Models.Document>;
    className?: string;
}) => {
    // undefined means the user's vote is still loading; null means they have not voted.
    const [votedDocument, setVotedDocument] = React.useState<VoteDocument | null>(); // undefined means not fetched yet
    // Start with the number of upvotes minus the number of downvotes.
    const [voteResult, setVoteResult] = React.useState<number>(upvotes.total - downvotes.total);

    // Read the signed-in user and navigation helper used to redirect guests to login.
    const { user } = useAuthStore();
    const router = useRouter();

    // Look up this user's existing vote when the user or target item changes.
    React.useEffect(() => {
        (async () => {
            if (user) {
                // Find a vote matching this item and the current user's ID.
                const response = await databases.listDocuments<VoteDocument>(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeId", id),
                    Query.equal("votedById", user.$id),
                ]);
                setVotedDocument(() => response.documents[0] || null);
            }
        })();
    }, [user, id, type]);

    // Submit an upvote; guests are sent to login and the count updates from the API response.
    const toggleUpvote = async () => {
        if (!user) return router.push("/login");

        // Wait until the existing vote lookup has completed before allowing another vote.
        if (votedDocument === undefined) return;

        try {
            // Send the vote choice and the item it belongs to the server.
            const response = await fetch(`/api/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "upvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            // Update the displayed total and remember the user's latest vote.
            setVoteResult(() => data.data.voteResult);
            setVotedDocument(() => data.data.VoteDocument);
        } catch (error: any) {
            // Let the user know if the vote request failed.
            window.alert(error?.message || "Something went wrong");
        }
    };

    // Submit a downvote using the same flow as an upvote, with a different vote status.
    const toggleDownvote = async () => {
        if (!user) return router.push("/login");

        // Do not submit while the existing vote is still being looked up.
        if (votedDocument === undefined) return;

        try {
            // Send the downvote choice and the item it belongs to the server.
            const response = await fetch(`/api/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "downvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            // Refresh the displayed total and the user's current vote from the response.
            setVoteResult(() => data.data.voteResult);
            setVotedDocument(() => data.data.document);
        } catch (error: any) {
            // Let the user know if the vote request failed.
            window.alert(error?.message || "Something went wrong");
        }
    };

    // Render the upvote and downvote controls, highlighting the option the user selected.
    return (
        <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-4", className)}>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument && votedDocument.voteStatus === "upvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={toggleUpvote}
            >
                <IconCaretUpFilled />
            </button>
            <span>{voteResult}</span>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument && votedDocument.voteStatus === "downvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={toggleDownvote}
            >
                <IconCaretDownFilled />
            </button>
        </div>
    );
};

export default VoteButtons;