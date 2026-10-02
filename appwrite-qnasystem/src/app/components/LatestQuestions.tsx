// Displays one question's details using a reusable card.
import QuestionCard from "@/components/QuestionCard";
// Names the database and collections used to load questions, answers, and votes.
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
// Provides server-side access to database records and user profiles.
import { databases, users } from "@/models/server/config";
// Describes the user profile fields needed for each question's author.
import { UserPrefs } from "@/store/Auth";
// Provides the base document type used to describe question records.
import { Models } from "appwrite";
// Builds database filters, sorting, and result limits.
import { Query } from "node-appwrite";
import React from "react";

// Describe the fields stored in an Appwrite question document.
type QuestionDocument = Models.Document & {
    title: string;
    tags: string[];
    authorId: string;
};

// Describe the author information and counts added for the question card.
type QuestionWithDetails = QuestionDocument & {
    totalVotes: number;
    totalAnswers: number;
    author: {
        $id: string;
        name: string;
        reputation: number;
    };
};

const LatestQuestions = async () => {
    // Get the five newest questions from the database.
    const questions = await databases.listDocuments<QuestionDocument>(db, questionCollection, [
        Query.limit(5),
        Query.orderDesc("$createdAt"),
    ]);
    console.log("Fetched Questions:", questions);

    // Load each question's author details and the total numbers of answers and votes.
    const questionsWithDetails: QuestionWithDetails[] = await Promise.all(
        questions.documents.map(async ques => {
            // Fetch the author and counts at the same time because these lookups are independent.
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

            // Add the fetched author information and activity counts to the question.
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

    // Display each question in its own card.
    console.log("Latest question")
    console.log(questions)
    return (
        <div className="space-y-6">
            {/* Create one question card for every question returned from the database. */}
            {questionsWithDetails.map(question => (
                <QuestionCard key={question.$id} ques={question} />
            ))}
        </div>
    );
};

// Make this component available to pages that show the latest questions.
export default LatestQuestions;