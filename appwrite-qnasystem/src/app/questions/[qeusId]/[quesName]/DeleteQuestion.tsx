"use client";

import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

// Shows a delete control only to the author of the question.
const DeleteQuestion = ({ questionId, authorId }: { questionId: string; authorId: string }) => {
    // Provides navigation after a successful deletion and the current signed-in user.
    const router = useRouter();
    const { user } = useAuthStore();

    // Remove the question from Appwrite, then return to the questions list.
    const deleteQuestion = async () => {
        try {
            await databases.deleteDocument(db, questionCollection, questionId);

            router.push("/questions");
        } catch (error: any) {
            // Show an error if Appwrite cannot delete the question.
            window.alert(error?.message || "Something went wrong");
        }
    };

    // Do not render the delete button for users who do not own this question.
    return user?.$id === authorId ? (
        <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
            onClick={deleteQuestion}
        >
            <IconTrash className="h-4 w-4" />
        </button>
    ) : null;
};

export default DeleteQuestion;

