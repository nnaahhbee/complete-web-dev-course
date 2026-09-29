import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";
import { Models } from "appwrite";

// Describes the Appwrite question fields needed by the edit screen and form.
type QuestionDocument = Models.Document & {
    title: string;
    content: string;
    authorId: string;
    tags: string[];
    attachmentId: string;
};

// This server page loads the selected question, then passes it to the client edit screen.
const Page = async ({params,}: {params: Promise<{ quesId: string; quesName: string }>;
}) => {
    // Next.js provides route parameters as a promise; get the ID from the URL.
    const { quesId } = await params;
    // Fetch the existing question from the Appwrite question collection.
    const question = await databases.getDocument<QuestionDocument>(
        db,
        questionCollection,
        quesId
    );

    // Give the loaded document to the client component that handles ownership and editing.
    return <EditQues question={question} />;
};

export default Page;