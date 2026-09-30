// Adds page controls so users can browse through their votes.
import Pagination from "@/components/Pagination";
// Names the database and collections used to find votes and related content.
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
// Provides server-side access to database records.
import { databases } from "@/models/server/config";
// Formats vote dates as readable relative times, such as "yesterday."
import convertDateToRelativeTime from "@/utils/relativeTime";
// Converts question titles into URL-friendly text.
import slugify from "slugify";
import Link from "next/link";
// Builds database filters, sorting, and pagination options.
import { Query } from "node-appwrite";
import React from "react";

// Load and show the votes made by this user, with an optional upvote/downvote filter.
const Page = async ({
    params,
    searchParams,
}: {
    params: { userId: string; userSlug: string };
    searchParams: { page?: string; voteStatus?: "upvoted" | "downvoted" };
}) => {
    // Use the first page when the URL does not specify a page number.
    searchParams.page ||= "1";

    // Find this user's newest votes and select 25 votes for the requested page.
    const query = [
        Query.equal("votedById", params.userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+searchParams.page - 1) * 25),
        Query.limit(25),
    ];

    // If a vote type was selected, only include votes matching that type.
    if (searchParams.voteStatus) query.push(Query.equal("voteStatus", searchParams.voteStatus));

    // Fetch the selected page of votes from the database.
    const votes = await databases.listDocuments(db, voteCollection, query);

    // Find the question connected to each vote so it can be shown as a link.
    votes.documents = await Promise.all(
        votes.documents.map(async vote => {
            // A vote can be on a question directly or on an answer.
            const questionOfTypeQuestion =
                vote.type === "question"
                    ? await databases.getDocument(db, questionCollection, vote.typeId, [
                          Query.select(["title"]),
                      ])
                    : null;

            // For a question vote, the question record was already loaded above.
            if (questionOfTypeQuestion) {
                return {
                    ...vote,
                    question: questionOfTypeQuestion,
                };
            }

            // For an answer vote, first find the answer and then its parent question.
            const answer = await databases.getDocument(db, answerCollection, vote.typeId);
            const questionOfTypeAnswer = await databases.getDocument(
                db,
                questionCollection,
                answer.questionId,
                [Query.select(["title"])]
            );

            // Attach the related question to the vote so the page can display it.
            return {
                ...vote,
                question: questionOfTypeAnswer,
            };
        })
    );

    // Show the vote count, filter links, vote records, and page controls.
    return (
        <div className="px-4">
            <div className="mb-4 flex justify-between">
                <p>{votes.total} votes</p>
                {/* Let the user switch between all votes, upvotes, and downvotes. */}
                <ul className="flex gap-1">
                    <li>
                        <Link
                            href={`/users/${params.userId}/${params.userSlug}/votes`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                !searchParams.voteStatus ? "bg-white/20" : "hover:bg-white/20"
                            }`}
                        >
                            All
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${params.userId}/${params.userSlug}/votes?voteStatus=upvoted`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                searchParams?.voteStatus === "upvoted"
                                    ? "bg-white/20"
                                    : "hover:bg-white/20"
                            }`}
                        >
                            Upvotes
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${params.userId}/${params.userSlug}/votes?voteStatus=downvoted`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                searchParams?.voteStatus === "downvoted"
                                    ? "bg-white/20"
                                    : "hover:bg-white/20"
                            }`}
                        >
                            Downvotes
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {/* Display each vote's type, related question, and date. */}
                {votes.documents.map(vote => (
                    <div
                        key={vote.$id}
                        className="rounded-xl border border-white/40 p-4 duration-200 hover:bg-white/10"
                    >
                        <div className="flex">
                            <p className="mr-4 shrink-0">{vote.voteStatus}</p>
                            <p>
                                <Link
                                    href={`/questions/${vote.question.$id}/${slugify(vote.question.title)}`}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    {vote.question.title}
                                </Link>
                            </p>
                        </div>
                        <p className="text-right text-sm">
                            {convertDateToRelativeTime(new Date(vote.$createdAt))}
                        </p>
                    </div>
                ))}
            </div>
            {/* Allow navigation through vote results, showing 25 votes per page. */}
            <Pagination total={votes.total} limit={25} />
        </div>
    );
};

// Make this page available as the user's Votes profile section.
export default Page;