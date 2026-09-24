// Import the database and collection names used to store answers.
import { answerCollection, db } from "@/models/name";
// Import the Appwrite services used to manage answer documents and user preferences.
import { databases, users } from "@/models/server/config";
// Import Next.js request and response helpers for this API route.
import { NextRequest, NextResponse } from "next/server";
// Import Appwrite's helper for generating a unique document ID.
import { ID } from "node-appwrite";
// Import the TypeScript shape of the user's preferences.
import {UserPrefs} from "@/store/Auth"

// Handle requests that create a new answer.
export async function POST(request: NextRequest){
    try {
        // Read the question, answer text, and author ID sent in the request body.
        const {questionId, answer, authorId} = await request.json();

        // Save the new answer as a document in the answers collection.
        const response = await databases.createDocument(db, answerCollection, ID.unique(), {
            content: answer,
            authorId: authorId,
            questionId: questionId
        })

        // Read the author's current preferences so the reputation can be increased.
        const prefs = await users.getPrefs<UserPrefs>(authorId)
        // Add one reputation point after the author successfully posts an answer.
        await users.updatePrefs(authorId, {
            reputation: Number(prefs.reputation) + 1
        })

        // Return the newly created answer with an HTTP 201 Created status.
        return NextResponse.json(response, {
            status: 201
        })

        
    } catch (error: any) {
        // Convert an Appwrite or server error into a JSON response for the client.
        return NextResponse.json(
            {
                error: error?.message || "Error creating answer"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
    }
}


// Handle requests that delete an existing answer.
export async function DELETE(request: NextRequest){
    try {
       // Read the ID of the answer that should be deleted.
       const {answerId} = await request.json()

       // Fetch the answer first so its author ID is available after deletion.
       const answer = await databases.getDocument(db, answerCollection, answerId) 

       // Remove the answer document from the answers collection.
       const response = await databases.deleteDocument(db, answerCollection, answerId)

       // Read the author's current preferences before decreasing reputation.
       const prefs = await users.getPrefs<UserPrefs>(answer.authorId)
        // Remove one reputation point because the author's answer was deleted.
        await users.updatePrefs(answer.authorId, {
            reputation: Number(prefs.reputation) - 1
        })

        // Return the deletion result with an HTTP 200 OK status.
        return NextResponse.json(
            {ata: response},
            {status: 200}
        )

        
    } catch (error: any) {
        // Return a JSON error response when fetching or deleting the answer fails.
        return NextResponse.json(
            {
                message: error?.message || "Error deleting the answer"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
        
    }
}