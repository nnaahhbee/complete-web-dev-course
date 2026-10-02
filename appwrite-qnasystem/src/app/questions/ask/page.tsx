import { databases, users } from "@/models/server/config";
import { answerCollection, db, voteCollection, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import React from "react";
import Link from "next/link";
import {ShimmerButton} from "@/components/ui/shimmer-button";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/Auth";
import Pagination from "@/components/Pagination";
import Search from "../Search";
import { Models } from "appwrite";
import QuestionForm from "@/components/QuestionForm";

// Load the question list on the server, using URL parameters for search, tags, and pagination.
const Page = async ({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; tag?: string; search?: string; showForm?: string }>;
}) => {
    const resolvedSearchParams = await searchParams;

    // Start at the first page when the URL does not include a page number.
    resolvedSearchParams.page ||= "1";
    const showQuestionForm = resolvedSearchParams.showForm === "true";

    // Ask Appwrite for the newest 25 questions on the selected page.
    const queries = [
        Query.orderDesc("$createdAt"),
        Query.offset((+resolvedSearchParams.page - 1) * 25),
        Query.limit(25),
    ];

    // If a tag is selected, only include questions that have that tag.
    if (resolvedSearchParams.tag) {
        queries.push(Query.equal("tags", resolvedSearchParams.tag));
    }
    // Search both the title and body while allowing either field to match.
    if (resolvedSearchParams.search)
        queries.push(
            Query.or([
                Query.search("title", resolvedSearchParams.search),
                Query.search("content", resolvedSearchParams.search),
            ])
        );

    // Describe the fields that are actually stored in an Appwrite question document.
    type QuestionDocument = Models.Document & {
        title: string;
        tags: string[];
        authorId: string;
    };

    // Describe the extra author and count details added before displaying each question.
    type QuestionWithDetails = QuestionDocument & {
        totalVotes: number;
        totalAnswers: number;
        author: {
            $id: string;
            name: string;
            reputation: number;
        };
    };

    // Fetch the question records using the fields needed by the page and QuestionCard.
    const questions = await databases.listDocuments<QuestionDocument>(db, questionCollection, queries);
    console.log("Questions", questions)

    // Fetch related author, answer-count, and vote-count data for every question.
    const questionsWithDetails: QuestionWithDetails[] = await Promise.all(
        questions.documents.map(async ques => {
            // Run independent Appwrite requests together to avoid waiting for them one at a time.
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

            // Add the related details that QuestionCard displays to the question record.
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

    // Render the page heading, search form, result count, question cards, and page controls.
    return (
        <div className="container mx-auto px-4 pb-20 pt-36">
            <div className="mb-10 flex items-center justify-between">
                <h1 className="text-3xl font-bold">All Questions</h1>
                <Link href={showQuestionForm ? "/questions/ask" : "/questions/ask?showForm=true"}>
                    <ShimmerButton className="shadow-2xl" >
                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                            {showQuestionForm ? "Hide form" : "Ask a question"}
                        </span>
                    </ShimmerButton>
                </Link>
            </div>
            {showQuestionForm && (
                <div className="mb-10 max-w-3xl">
                    <QuestionForm />
                </div>
            )}
            <div className="mb-4">
                <Search />
            </div>
            {/* Show the total matching questions, not just the current page's items. */}
            <div className="mb-4">
                <p>{questions.total} questions</p>
            </div>
            {/* Render one summary card for each question returned for this page. */}
            <div className="mb-4 max-w-3xl space-y-6">
                {questionsWithDetails.map(ques => (
                    <QuestionCard key={ques.$id} ques={ques} />
                ))}
            </div>
            {/* Provide navigation based on the total results and the 25-question page size. */}
            <Pagination total={questions.total} limit={25} />
        </div>
    );
};

export default Page;