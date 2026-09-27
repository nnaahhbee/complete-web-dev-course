"use client";

// Import React for component state, refs, and lifecycle effects.
import React from "react";
// Import the animated border decoration used around the card.
import { BorderBeam } from "./ui/border-beam";
// Import Next.js navigation links for question, tag, and author pages.
import Link from "next/link";
// Import Appwrite's base document type.
import { Models } from "appwrite";
// Import a helper to make titles and names safe to use in URLs.
import slugify from "slugify"
// Import the Appwrite service that generates placeholder avatars from names.
import { avatars } from "@/models/client/config";
// Import a helper that formats dates as relative time, such as "3 days ago".
import convertDateToRelativeTime from "@/utils/relativeTime";

// Extend an Appwrite document with the question and author details shown on this card.
interface QuestionDocument extends Models.Document {
    title: string;
    tags: string[];
    totalVotes: number;
    totalAnswers: number;
    author: {
        $id: string;
        name: string;
        reputation: number;
    };
}

// Display a summary card for one question.
const QuestionCard = ({ ques }: { ques: QuestionDocument }) => {
    // Store the card's height so the decorative beam can match its size.
    const [height, setHeight] = React.useState(0);
    // Keep a reference to the card's DOM element so its height can be measured.
    const ref = React.useRef<HTMLDivElement>(null);

    // Measure the card after it renders and save its height in component state.
    React.useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }, [ref]);

    // Render the question summary, its tags, author information, and creation time.
    return(
        <div
            ref={ref}
            className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/20 bg-white/5 p-4 duration-200 hover:bg-white/10 sm:flex-row"
        >
            {/* Draw a decorative animated beam sized to the card's measured height. */}
            <BorderBeam size={height} duration={12} delay={9} />
            {/* Show the question's vote and answer totals. */}
            <div className="relative shrink-0 text-sm sm:text-right">
                <p>{ques.totalVotes} votes</p>
                <p>{ques.totalAnswers} answers</p>
            </div>
            <div className="relative w-full">
                {/* Link the question title to its detail page. */}
                <Link
                    href={`/questions/${ques.$id}/${slugify(ques.title)}`}
                    className="text-orange-500 duration-200 hover:text-orange-600"
                >
                    <h2 className="text-xl">{ques.title}</h2>
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    {/* Show each tag as a link to questions filtered by that tag. */}
                    {ques.tags.map((tag: string) => (
                        <Link
                            key={tag}
                            href={`/questions?tag=${tag}`}
                            className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
                        >
                            #{tag}
                        </Link>
                    ))}
                    {/* Show the author's generated avatar, profile link, and reputation. */}
                    <div className="ml-auto flex items-center gap-1">
                        <picture>
                            <img
                                src={avatars.getInitials(ques.author.name, 24, 24)}
                                alt={ques.author.name}
                                className="rounded-lg"
                            />
                        </picture>
                        <Link
                            href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
                            className="text-orange-500 hover:text-orange-600"
                        >
                            {ques.author.name}
                        </Link>
                        <strong>&quot;{ques.author.reputation}&quot;</strong>
                    </div>
                    {/* Convert the creation timestamp into a human-readable relative date. */}
                    <span>asked {convertDateToRelativeTime(new Date(ques.$createdAt))}</span>
                </div>
            </div>
        </div>
    );
};

// Export the card so question lists can display it.
export default QuestionCard;