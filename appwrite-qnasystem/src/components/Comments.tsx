"use client";

import { databases } from "@/models/client/config";
import { commentCollection, db } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils"
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "slugify";
import { Trash2 } from "lucide-react";
import { ID, Models } from "appwrite";
import Link from "next/link";
import React from "react";

// Describes a comment as it is used by the UI, including the author's display name.
type CommentDocument = Models.Document & {
    content: string;
    authorId: string;
    author: { name: string };
};

// Describes the fields saved in Appwrite when a new comment is created.
type StoredComment = Models.Document & {
    content: string;
    authorId: string;
    type: "question" | "answer";
    typeId: string;
};

// Renders comments for a question or answer and lets signed-in users add or delete their own.
const Comments = ({
    comments: _comments,
    type,
    typeId,
    className,
}: {
    comments: Models.DocumentList<CommentDocument>;
    type: "question" | "answer";
    typeId: string;
    className?: string;
}) => {
    // Keep a local copy so the list can update immediately after adding or deleting a comment.
    const [comments, setComments] = React.useState(_comments);
    // Stores the text currently entered in the comment box.
    const [newComment, setNewComment] = React.useState("");
    // The current signed-in user, used to save comments and control who can delete them.
    const { user } = useAuthStore();

    // Save a new comment to Appwrite, then add it to the visible list.
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Do not submit an empty comment or a comment without a signed-in author.
        if (!newComment || !user) return;

        try {
            // Store the comment text and identify whether it belongs to this question or answer.
            const response = await databases.createDocument<StoredComment>(db, commentCollection, ID.unique(), {
                content: newComment,
                authorId: user.$id,
                type: type,
                typeId: typeId,
            });

            // Clear the input and show the newly saved comment at the top of the list.
            setNewComment(() => "");
            setComments(prev => ({
                total: prev.total + 1,
                documents: [{ ...response, author: user }, ...prev.documents],
            }));
        } catch (error: any) {
            // Show a message if Appwrite could not save the comment.
            window.alert(error?.message || "Error creating comment");
        }
    };

    // Delete a comment from Appwrite, then remove it from the visible list.
    const deleteComment = async (commentId: string) => {
        try {
            await databases.deleteDocument(db, commentCollection, commentId);

            // Update both the displayed comment count and the list after deletion succeeds.
            setComments(prev => ({
                total: prev.total - 1,
                documents: prev.documents.filter(comment => comment.$id !== commentId),
            }));
        } catch (error: any) {
            // Show a message if Appwrite could not delete the comment.
            window.alert(error?.message || "Error deleting comment");
        }
    };

    // Render each comment, its author and time, plus the form for submitting another comment.
    return (
        <div className={cn("flex flex-col gap-2 pl-4", className)}>
            {/* Map the comment documents into individual comment rows. */}
            {comments.documents.map(comment => (
                <React.Fragment key={comment.$id}>
                    <hr className="border-white/40" />
                    <div className="flex gap-2">
                        <p className="text-sm">
                            {comment.content} -{" "}
                            <Link
                                href={`/users/${comment.authorId}/${slugify(comment.author.name)}`}
                                className="text-orange-500 hover:text-orange-600"
                            >
                                {comment.author.name}
                            </Link>{" "}
                            <span className="opacity-60">
                                {convertDateToRelativeTime(new Date(comment.$createdAt))}
                            </span>
                        </p>
                        {/* Only show the delete button to the author of this comment. */}
                        {user?.$id === comment.authorId ? (
                            <button
                                onClick={() => deleteComment(comment.$id)}
                                className="shrink-0 text-red-500 hover:text-red-600"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        ) : null}
                    </div>
                </React.Fragment>
            ))}
            <hr className="border-white/40" />
            {/* Submitting this form calls handleSubmit; the textarea is kept in sync with state. */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <textarea
                    className="w-full rounded-md border border-white/20 bg-white/10 p-2 outline-none"
                    rows={1}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={e => setNewComment(() => e.target.value)}
                />
                <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                    Add Comment
                </button>
            </form>
        </div>
    );
};

export default Comments;
