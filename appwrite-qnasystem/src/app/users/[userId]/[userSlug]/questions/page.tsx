// Adds page controls for browsing a long list of questions.
import Pagination from "@/components/Pagination";
// Displays one question's details in a reusable card.
import QuestionCard from "@/components/QuestionCard";
// Names the database and the collections used to load questions, answers, and votes.
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
// Provides server-side access to profile data and database records.
import { databases, users } from "@/models/server/config";
// Describes the user fields needed to display each question's author.
import { UserPrefs } from "@/store/Auth";
// Provides the base document type used to describe question records.
import { Models } from "appwrite";
// Builds database filters, sorting, and pagination options.
import { Query } from "node-appwrite";
import React from "react";

// Load and display the questions posted by the user in this profile.
const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string }>;
}) => {
    const { userId } = await params;
    const resolvedSearchParams = await searchParams;

    // Show the first page when the URL does not include a page number.
    resolvedSearchParams.page ||= "1";

    // Find this user's newest questions and select 25 records for the requested page.
    const queries = [
        Query.equal("authorId", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+resolvedSearchParams.page - 1) * 25),
        Query.limit(25),
    ];

    // Describe the fields stored in an Appwrite question document.
    type QuestionDocument = Models.Document & {
        title: string;
        tags: string[];
        authorId: string;
    };

    // Describe the author information and counts added for each question card.
    type QuestionWithDetails = QuestionDocument & {
        totalVotes: number;
        totalAnswers: number;
        author: {
            $id: string;
            name: string;
            reputation: number;
        };
    };

    // Fetch the selected page of this user's questions using the expected document shape.
    const questions = await databases.listDocuments<QuestionDocument>(db, questionCollection, queries);

    // Load each question's author and count its answers and votes.
    const questionsWithDetails: QuestionWithDetails[] = await Promise.all(
        questions.documents.map(async ques => {
            // Run these three independent lookups at the same time.
            const [author, answers, votes] = await Promise.all([
                users.get<UserPrefs>(ques.authorId),
                databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", ques.$id),
                    Query.limit(1), // for optimization
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "question"),
                    Query.equal("typeId", ques.$id),
                    Query.limit(1), // for optimization
                ]),
            ]);

            // Add the latest counts and author details to the question for display.
            return {
                ...ques,
                totalAnswers: answers.total,
                totalVotes: votes.total,
                author: {
                    $id: author.$id,
                    reputation: author.prefs.reputation,
                    name: author.name,
                },
            };
        })
    );

    // Show the total number of questions, a card for each result, and page controls.
    return (
        <div className="px-4">
            <div className="mb-4">
                <p>{questions.total} questions</p>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {/* Render each question with the reusable question card component. */}
                {questionsWithDetails.map(ques => (
                    <QuestionCard key={ques.$id} ques={ques} />
                ))}
            </div>
            {/* Allow navigation through question results, 25 at a time. */}
            <Pagination total={questions.total} limit={25} />
        </div>
    );
};

// Make this page available as the user's Questions profile section.
export default Page;