"use client";

import RTE from "@/components/RTE";
import {Meteors} from "@/components/ui/meteors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import slugify from "slugify"
import { X } from "lucide-react";
import { Models, ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { databases, storage } from "@/models/client/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import confetti from "canvas-confetti";


// Add the question-specific fields to Appwrite's standard document properties.
interface QuestionDocument extends Models.Document {
    title: string;
    content: string;
    authorId: string;
    tags: string[];
    attachmentId: string;
}

// Wrap form sections in consistent styling and add the animated meteor background.
const LabelInputContainer = ({
    children,
    className,
}:
{
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4",
                className
            )}
        >
            <Meteors number={30} />
            {children}
        </div>
    );
};


// Create a form for publishing a new question or editing an existing one.
const QuestionForm = ({question} : {question?: QuestionDocument}) => {
    // Read the currently signed-in user, keep the current tag input, and get navigation tools.
    const { user } = useAuthStore();
    const [tag, setTag] = React.useState("");
    const router = useRouter();

    // Keep the question fields in React state; use existing question values when editing.
    const [formData, setFormData] = React.useState({
        title: String(question?.title || ""),
        content: String(question?.content || ""),
        authorId: user?.$id,
        tags: new Set((question?.tags || []) as string[]),
        attachment: null as File | null,
    });

    // Track whether a save is in progress and hold any error message to show the user.
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    // Show a short burst of confetti after a question is successfully created.
    const loadConfetti = (timeInMS = 3000) => {
        const end = Date.now() + timeInMS; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            // Stop creating confetti once the requested display time has passed.
            if (Date.now() > end) return;

            // Launch particles from the left and right sides of the screen.
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });
            // Schedule another animation frame so the confetti continues briefly.
            requestAnimationFrame(frame);
    };
    frame(); 
};

    // Upload the selected attachment and save a new question document in Appwrite.
    const create = async () => {
            // A new question currently requires an image attachment.
            if (!formData.attachment) throw new Error("Please upload an image");

            // Store the uploaded image in the question attachments bucket.
            const storageResponse = await storage.createFile(
                questionAttachmentBucket,
                ID.unique(),
                formData.attachment
            );

            // Create the question document and save the uploaded file's ID with it.
            const response = await databases.createDocument(db, questionCollection, ID.unique(), {
                title: formData.title,
                content: formData.content,
                authorId: formData.authorId,
                tags: Array.from(formData.tags),
                attachmentId: storageResponse.$id,
            });

            // Celebrate a successful question creation and return the saved document.
            loadConfetti();

            return response;
    };

    // Update an existing question and replace its attachment only if a new file was selected.
    const update = async () => {
            // Editing requires an existing question document to update.
            if (!question) throw new Error("Please provide a question");

            // Keep the existing attachment ID unless the user selected a replacement image.
            const attachmentId = await (async () => {
                if (!formData.attachment) return question?.attachmentId as string;

                // Delete the old image before uploading the replacement.
                await storage.deleteFile(questionAttachmentBucket, question.attachmentId);

                // Upload the replacement image and use its new ID in the question document.
                const file = await storage.createFile(
                    questionAttachmentBucket,
                    ID.unique(),
                    formData.attachment
                );

                return file.$id;
            })();

            // Save the edited question fields and its current attachment ID to Appwrite.
            const response = await databases.updateDocument(db, questionCollection, question.$id, {
                title: formData.title,
                content: formData.content,
                authorId: formData.authorId,
                tags: Array.from(formData.tags),
                attachmentId: attachmentId,
            });

            return response;
    };

    // Validate and save the form, then navigate to the saved question's page.
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        // Prevent the browser's default form submission and page reload.
        e.preventDefault();

        // didn't check for attachment because it's optional in updating
        if (!formData.title || !formData.content || !formData.authorId) {
            setError(() => "Please fill out all fields");
            return;
        }

        // Show the loading state and clear any old error before saving.
        setLoading(() => true);
        setError(() => "");

        try {
            // Choose the update or create operation based on whether a question was passed in.
            const response = question ? await update() : await create();

            // Open the question page using its ID and a URL-friendly version of its title.
            router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
        } catch (error: any) {
            // Show the error message if the upload or database operation failed.
            setError(() => error.message);
        }

        // Re-enable the form after the save attempt completes.
        setLoading(() => false);
    };


    // Render the question form and connect its submission to the submit handler.
     return (
        <form className="space-y-4" onSubmit={submit}>
            {/* Show an error section only when there is an error to display. */}
            {error && (
                <LabelInputContainer>
                    <div className="text-center">
                        <span className="text-red-500">{error}</span>
                    </div>
                </LabelInputContainer>
            )}
            {/* Let the user enter the question title. */}
            <LabelInputContainer>
                <Label htmlFor="title">
                    Title Address
                    <br />
                    <small>
                        Be specific and imagine you&apos;re asking a question to another person.
                    </small>
                </Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
            </LabelInputContainer>
            {/* Let the user write the question details with the Markdown editor. */}
            <LabelInputContainer>
                <Label htmlFor="content">
                    What are the details of your problem?
                    <br />
                    <small>
                        Introduce the problem and expand on what you put in the title. Minimum 20
                        characters.
                    </small>
                </Label>
                <RTE
                    value={formData.content}
                    onChange={value => setFormData(prev => ({ ...prev, content: value || "" }))}
                />
            </LabelInputContainer>
            {/* Let the user choose an image file to attach to the question. */}
            <LabelInputContainer>
                <Label htmlFor="image">
                    Image
                    <br />
                    <small>
                        Add image to your question to make it more clear and easier to understand.
                    </small>
                </Label>
                <Input
                    id="image"
                    name="image"
                    accept="image/*"
                    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                    type="file"
                    onChange={e => {
                        // Ignore the change if no file was selected; otherwise store the first file.
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setFormData(prev => ({
                            ...prev,
                            attachment: files[0],
                        }));
                    }}
                />
            </LabelInputContainer>
            {/* Let the user add tags and show the tags currently attached to the question. */}
            <LabelInputContainer>
                <Label htmlFor="tag">
                    Tags
                    <br />
                    <small>
                        Add tags to describe what your question is about. Start typing to see
                        suggestions.
                    </small>
                </Label>
                <div className="flex w-full gap-4">
                    <div className="w-full">
                        <Input
                            id="tag"
                            name="tag"
                            placeholder="e.g. (java c objective-c)"
                            type="text"
                            value={tag}
                            onChange={e => setTag(() => e.target.value)}
                        />
                    </div>
                    <button
                        className="relative shrink-0 rounded-full border border-slate-600 bg-slate-700 px-8 py-2 text-sm text-white transition duration-200 hover:shadow-2xl hover:shadow-white/10"
                        type="button"
                        onClick={() => {
                            // Add a non-empty tag to the Set, then clear the tag input.
                            if (tag.length === 0) return;
                            setFormData(prev => ({
                                ...prev,
                                tags: new Set([...Array.from(prev.tags), tag]),
                            }));
                            setTag(() => "");
                        }}
                    >
                        <div className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-linear-to-r from-transparent via-teal-500 to-transparent shadow-2xl" />
                        <span className="relative z-20">Add</span>
                    </button>
                </div>
                {/* Display each tag with a button that removes it from the question. */}
                <div className="flex flex-wrap gap-2">
                    {Array.from(formData.tags).map((tag, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="group relative inline-block rounded-full bg-slate-800 p-px text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900">
                                <span className="absolute inset-0 overflow-hidden rounded-full">
                                    <span className="absolute inset-0 rounded-full bg-[radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                </span>
                                <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10">
                                    <span>{tag}</span>
                                    <button
                                        onClick={() => {
                                            // Create a new Set without the selected tag.
                                            setFormData(prev => ({
                                                ...prev,
                                                tags: new Set(
                                                    Array.from(prev.tags).filter(t => t !== tag)
                                                ),
                                            }));
                                        }}
                                        type="button"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                <span className="absolute bottom-0 left-4.5 h-px w-[calc(100%-2.25rem)] bg-linear-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                            </div>
                        </div>
                    ))}
                </div>
            </LabelInputContainer>
            {/* Submit the form; disable the button while the save operation is running. */}
            <button
                className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-size-[200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                type="submit"
                disabled={loading}
            >
                {question ? "Update" : "Publish"}
            </button>
        </form>
    );
};

// Export the form so question pages can use it for creating or editing questions.
export default QuestionForm;
