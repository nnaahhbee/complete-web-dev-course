import React from "react";
// Displays the question cards in the animated, scrolling hero section.
import { HeroParallax } from "@/components/ui/hero-parallax";
// Provides server-side access to the questions collection.
import { databases } from "@/models/server/config";
// Identifies the database, question collection, and attachment storage bucket.
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
// Creates database sorting and result-limit options.
import { Query } from "node-appwrite";
// Converts question titles into URL-friendly text for question links.
import slugify from "slugify";
// Creates preview URLs for the question attachment images.
import { storage } from "@/models/client/config";
// Supplies the custom heading shown above the question cards.
import HeroSectionHeader from "./HeroSectionHeader";

export default async function HeroSection() {
    // Load the 15 newest questions to display in the hero animation.
    const questions = await databases.listDocuments(db, questionCollection, [
        Query.orderDesc("$createdAt"),
        Query.limit(15),
    ]);

    // Give each question a title, destination link, and image for the hero display.
    return (
        <HeroParallax
            header={<HeroSectionHeader />}
            products={questions.documents.map(q => ({
                title: q.title,
                link: `/questions/${q.$id}/${slugify(q.title)}`,
                thumbnail: storage.getFilePreview(questionAttachmentBucket, q.attachmentId),
            }))}
        />
    );
}