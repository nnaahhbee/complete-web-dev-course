// Import the database and collection names used to store questions, answers, and votes.
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
// Import Appwrite services for database operations and user preference updates.
import { databases, users } from "@/models/server/config";
// Import the type that describes a user's reputation preference.
import { UserPrefs } from "@/store/Auth";
// Import Next.js request and response helpers for this API route.
import { NextRequest, NextResponse } from "next/server";
// Import helpers for generating unique IDs and building database queries.
import { ID, Query } from "node-appwrite";

// Handle a request to add, change, or remove a user's vote.
export async function POST(request: NextRequest){
    try {
        // Read the voter, vote direction, item type, and item ID from the request body.
        const {votedById, voteStatus, type, typeId} = await request.json()

        // Find whether this user has already voted on this question or answer.
        const response = await databases.listDocuments(
            db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", votedById),
            ]
        )
        // If an earlier vote exists, remove it before applying the new vote state.
        if (response.documents.length > 0) {
            await databases.deleteDocument(db, voteCollection, response.documents[0].$id)

            // Find the question or answer whose author's reputation must be adjusted.
            const QuestionOrAnswer = await databases.getDocument(
                db,
                type === "question" ? questionCollection: answerCollection,
                typeId
            );

            // Read the author's current reputation before changing it.
            const authorPrefs = await users.getPrefs<UserPrefs>(QuestionOrAnswer.authorId);

            // Undo the reputation effect of the previous vote.
            await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
                reputation: response.documents[0].voteStatus === "upvoted" ? Number(authorPrefs.reputation) - 1 : Number(authorPrefs.reputation) + 1
            })
            
        }

        // Create a new vote when there was no previous vote or the vote direction changed.
            if (response.documents[0]?.voteStatus !== voteStatus) {
                // Store the new vote in the votes collection with a unique document ID.
                const doc = await databases.createDocument(db, voteCollection, ID.unique(), {
                    type, 
                    typeId,
                    voteStatus,
                    votedById
                });

                // Find the question or answer author whose reputation will be updated.
                const QuestionOrAnswer = await databases.getDocument(
                db,
                type === "question" ? questionCollection: answerCollection,
                typeId
                );

                // Read the author's current reputation.
                const authorPrefs = await users.getPrefs<UserPrefs>(QuestionOrAnswer.authorId)

                // Apply the reputation change based on whether this replaces an earlier vote.
                if(response.documents[0]){
            await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
                reputation: 
                // Reverse the effect of the previous vote before applying the new one.
                response.documents[0].voteStatus === "upvoted" ? Number(authorPrefs.reputation) - 1 : Number(authorPrefs.reputation) + 1,
            });
                }else {
            await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
                reputation: 
                // Give or remove one point when this is the first vote from this user.
                voteStatus === "upvoted" ? Number(authorPrefs.reputation) + 1 : Number(authorPrefs.reputation) - 1,
            });
                }

                // Count upvotes and downvotes at the same time to calculate the net vote result.
                const [upvotes, downvotes] = await Promise.all([
            // Find upvotes for this question or answer.
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "upvoted"),
                Query.equal("votedById", votedById),
                Query.limit(1),
            ]),
            databases.listDocuments(db, voteCollection, [
            // Find downvotes for this question or answer.
            Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "downvoted"),
                Query.equal("votedById", votedById),
                Query.limit(1),
            ]),
        ]);

        // Return the new vote and the net vote score to the client.
        return NextResponse.json(
            {
                data: {
                    document: doc, voteResult: upvotes.total - downvotes.total
                },
                message: response.documents[0] ? "Vote Status Updated" : "Voted",
            },
            {
                status: 200
            }
        );
        }
            

        // Count the remaining upvotes and downvotes after the existing vote was withdrawn.
        const [upvotes, downvotes] = await Promise.all([
            // Find upvotes for this question or answer.
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "upvoted"),
                Query.equal("votedById", votedById),
                Query.limit(1),
            ]),
            // Find downvotes for this question or answer.
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "downvoted"),
                Query.equal("votedById", votedById),
                Query.limit(1),
            ]),
        ]);

        // Return the updated score when the user removes their vote.
        return NextResponse.json(
            {
                data: {
                    document: null, voteResult: upvotes.total - downvotes.total
                },
                message: "Vote WIthdrawn",
            },
            {
                status: 200
            }
        );
        
    } catch (error: any) {
        // Convert any Appwrite or server error into a JSON error response.
        return NextResponse.json(
            {error: error?.message || "Error in voting"},
            {status: error?.status || error?.code || 500}
        )
        
    }
}