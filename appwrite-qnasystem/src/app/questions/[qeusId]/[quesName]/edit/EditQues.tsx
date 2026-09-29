"use client";

import QuestionForm from "@/components/QuestionForm";
import { useAuthStore } from "@/store/Auth";
import slugify from "slugify";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

// Describes the question fields this screen passes to the reusable edit form.
type QuestionDocument = Models.Document & {
    title: string;
    content: string;
    authorId: string;
    tags: string[];
    attachmentId: string;
};

// Shows the question editing form and limits this UI to the question's author.
const EditQues = ({ question }: { question: QuestionDocument }) => {
    // Get the signed-in user's ID and a helper for navigating to another page.
    const { user } = useAuthStore();
    const router = useRouter();

    // If the signed-in user is not the author, send them back to the question page.
    React.useEffect(() => {
        if (question.authorId !== user?.$id) {
            router.push(`/questions/${question.$id}/${slugify(question.title)}`);
        }
    }, []);

    // Do not render the edit form when the current user is not the question author.
    if (user?.$id !== question.authorId) return null;

    // Render the page layout and provide the existing question to the shared form for editing.
    return (
        <div className="block pb-20 pt-32">
            <div className="container mx-auto px-4">
                <h1 className="mb-10 mt-4 text-2xl">Edit your public question</h1>

                <div className="flex flex-wrap md:flex-row-reverse">
                    <div className="w-full md:w-1/3"></div>
                    <div className="w-full md:w-2/3">
                        <QuestionForm question={question} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditQues;