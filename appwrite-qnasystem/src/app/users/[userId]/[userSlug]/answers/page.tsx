// Adds page controls so users can browse a long list of answers.
import Pagination from "@/components/Pagination";
// Displays each answer while formatting its Markdown text.
import { MarkdownPreview } from "@/components/RTE";
// Identifies the database and collections that store answers and questions.
import { answerCollection, db, questionCollection } from "@/models/name";
// Provides server-side access to the database.
import { databases } from "@/models/server/config";
// Turns question titles into URL-friendly text.
import slugify from "slugify";
import Link from "next/link";
// Builds database filters, sorting, and pagination options.
import { Query } from "node-appwrite";
import React from "react";

// Load and display one user's answers, with links back to the related questions.
const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string }>;
}) => {
    const { userId } = await params;
    const resolvedSearchParams = await searchParams;

    // Start on the first page when the URL does not specify a page number.
    resolvedSearchParams.page ||= "1";

    // Fetch this user's newest answers, requesting 25 answers for the selected page.
    const queries = [
        Query.equal("authorId", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+resolvedSearchParams.page - 1) * 25),
        Query.limit(25),
    ];

    // Get the selected page of answers from the database.
    const answers = await databases.listDocuments(db, answerCollection, queries);

    // Find each answer's question title so the page can link to that question.
    answers.documents = await Promise.all(
        answers.documents.map(async ans => {
            const question = await databases.getDocument(db, questionCollection, ans.questionId, [
                Query.select(["title"]),
            ]);
            return { ...ans, question };
        })
    );

    // Show the answer count, answer content, related question links, and page controls.
    return (
        <div className="px-4">
            <div className="mb-4">
                <p>{answers.total} answers</p>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {/* Render each answer and provide a link to its related question. */}
                {answers.documents.map(ans => (
                    <div key={ans.$id}>
                        <div className="max-h-40 overflow-auto">
                            <MarkdownPreview source={ans.content} className="rounded-lg p-4" />
                        </div>
                        <Link
                            href={`/questions/${ans.questionId}/${slugify(ans.question.title)}`}
                            className="mt-3 inline-block shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
                        >
                            Question
                        </Link>
                    </div>
                ))}
            </div>
            {/* Let the user move through answer pages, showing 25 answers per page. */}
            <Pagination total={answers.total} limit={25} />
        </div>
    );
};

// Make this page available as the user's Answers profile section.
export default Page;