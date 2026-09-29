import Answers, { type AnswerDocument } from "@/components/Answers";
import Comments, { type CommentDocument } from "@/components/Comments";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import {Particles} from "@/components/ui/particles";
import {ShimmerButton} from "@/components/ui/shimmer-button";
import { avatars } from "@/models/client/config";
import {answerCollection, db, voteCollection, questionCollection, commentCollection, questionAttachmentBucket} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { storage } from "@/models/client/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "slugify";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import { TracingBeam } from "@/components/ui/tracing-beam";


// Load one question and all related records on the server before rendering its detail page.
const Page = async ({params}: {params: {quesId: string; quesName: string}}) => {
    // Fetch the question, its answers, vote totals, and comments at the same time.
    // Promise.all lets independent database requests run in parallel.
    const [question, answers, upvotes, downvotes, comments] = await Promise.all([
        databases.getDocument(db, questionCollection, params.quesId),
        databases.listDocuments<AnswerDocument>(db, answerCollection, [
            Query.orderDesc("$createdAt"),
            Query.equal("questionId", params.quesId),
        ]),
         databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", params.quesId),
            Query.equal("type", "question"),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1), // for optimization
        ]),
         databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", params.quesId),
            Query.equal("type", "question"),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1), // for optimization
        ]),
        databases.listDocuments<CommentDocument>(db, commentCollection, [
            Query.equal("type", "question"),
            Query.equal("typeId", params.quesId),
            Query.orderDesc("$createdAt"),
        ]),  
    ]);

    // Look up the question author's profile details for the author section of the page.
    const author = await users.get<UserPrefs>(question.authorId);
    // Add author details to each question comment and enrich each answer with its related data.
    [comments.documents, answers.documents] = await Promise.all([
        Promise.all(
            comments.documents.map(async comment => {
                // Appwrite stores the author's ID on a comment; fetch the profile to display a name.
                const author = await users.get<UserPrefs>(comment.authorId);
                return {
                    ...comment,
                    author: {
                        $id: author.$id,
                        name: author.name,
                        reputation: author.prefs.reputation,
                    },
                };
            })
        ),
        Promise.all(
            answers.documents.map(async answer => {
                // For every answer, fetch its author, comments, and upvote/downvote lists together.
                const [author, comments, upvotes, downvotes] = await Promise.all([
                    users.get<UserPrefs>(answer.authorId),
                    databases.listDocuments<CommentDocument>(db, commentCollection, [
                        Query.equal("typeId", answer.$id),
                        Query.equal("type", "answer"),
                        Query.orderDesc("$createdAt"),
                    ]),
                    databases.listDocuments(db, voteCollection, [
                        Query.equal("typeId", answer.$id),
                        Query.equal("type", "answer"),
                        Query.equal("voteStatus", "upvoted"),
                        Query.limit(1), // for optimization
                    ]),
                    databases.listDocuments(db, voteCollection, [
                        Query.equal("typeId", answer.$id),
                        Query.equal("type", "answer"),
                        Query.equal("voteStatus", "downvoted"),
                        Query.limit(1), // for optimization
                    ]),
                ]);

                // Add each commenter's display details so the Comments component can render names.
                comments.documents = await Promise.all(
                    comments.documents.map(async comment => {
                        const author = await users.get<UserPrefs>(comment.authorId);
                        return {
                            ...comment,
                            author: {
                                $id: author.$id,
                                name: author.name,
                                reputation: author.prefs.reputation,
                            },
                        };
                    })
                );

                // Return the answer with all related information expected by the Answers component.
                return {
                    ...answer,
                    comments,
                    upvotesDocuments: upvotes,
                    downvotesDocuments: downvotes,
                    author: {
                        $id: author.$id,
                        name: author.name,
                        reputation: author.prefs.reputation,
                    },
                };
            })
        ),
    ]);

    // Render the question detail view, including the question controls, comments, and answers.
    return (
        <TracingBeam className="container pl-6">
            {/* Add the animated background decoration behind the question content. */}
            <Particles
                className="fixed inset-0 h-full w-full"
                quantity={500}
                ease={100}
                color="#ffffff"
                refresh
            />
            <div className="relative mx-auto px-4 pb-20 pt-36">
                {/* Show the question title, when it was asked, its answer count, and its vote count. */}
                <div className="flex">
                    <div className="w-full">
                        <h1 className="mb-1 text-3xl font-bold">{question.title}</h1>
                        <div className="flex gap-4 text-sm">
                            <span>
                                Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
                            </span>
                            <span>Answer {answers.total}</span>
                            <span>Votes {upvotes.total + downvotes.total}</span>
                        </div>
                    </div>
                    <Link href="/questions/ask" className="ml-auto inline-block shrink-0">
                        <ShimmerButton className="shadow-2xl">
                            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                Ask a question
                            </span>
                        </ShimmerButton>
                    </Link>
                </div>
                <hr className="my-4 border-white/40" />
                <div className="flex gap-4">
                    {/* Place voting and question-management controls beside the question. */}
                    <div className="flex shrink-0 flex-col items-center gap-4">
                        <VoteButtons
                            type="question"
                            id={question.$id}
                            className="w-full"
                            upvotes={upvotes}
                            downvotes={downvotes}
                        />
                        <EditQuestion
                            questionId={question.$id}
                            questionTitle={question.title}
                            authorId={question.authorId}
                        />
                        <DeleteQuestion questionId={question.$id} authorId={question.authorId} />
                    </div>
                    <div className="w-full overflow-auto">
                        {/* Display the question body as Markdown and show its uploaded attachment. */}
                        <MarkdownPreview className="rounded-xl p-4" source={question.content} />
                        <picture>
                            <img
                                src={
                                    storage.getFilePreview(
                                        questionAttachmentBucket,
                                        question.attachmentId
                                    )
                                }
                                alt={question.title}
                                className="mt-3 rounded-lg"
                            />
                        </picture>
                        {/* Link each question tag to the question list filtered by that tag. */}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                            {question.tags.map((tag: string) => (
                                <Link
                                    key={tag}
                                    href={`/questions?tag=${tag}`}
                                    className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                        {/* Show the question author's avatar, profile link, and reputation. */}
                        <div className="mt-4 flex items-center justify-end gap-1">
                            <picture>
                                <img
                                    src={avatars.getInitials(author.name, 36, 36)}
                                    alt={author.name}
                                    className="rounded-lg"
                                />
                            </picture>
                            <div className="block leading-tight">
                                <Link
                                    href={`/users/${author.$id}/${slugify(author.name)}`}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    {author.name}
                                </Link>
                                <p>
                                    <strong>{author.prefs.reputation}</strong>
                                </p>
                            </div>
                        </div>
                        {/* Pass the question's comments and ID to the reusable Comments component. */}
                        <Comments
                            comments={comments}
                            className="mt-4"
                            type="question"
                            typeId={question.$id}
                        />
                        <hr className="my-4 border-white/40" />
                    </div>
                </div>
                {/* Render the answers for this question and provide the answer submission form. */}
                <Answers answers={answers} questionId={question.$id} />
            </div>
        </TracingBeam>
    );
}