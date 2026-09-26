// Tell Next.js this component must run in the browser because the editor uses browser features.
"use client";

// Import Next.js's dynamic loader so the editor can be loaded only when needed.
import dynamic from "next/dynamic";
// Import the Markdown editor and its related components.
import Editor from "@uiw/react-markdown-editor";

// Load the Markdown editor dynamically and disable server-side rendering for it.
const RTE = dynamic(
    () => 
        // Import the editor package and return its default editor component.
        import("@uiw/react-markdown-editor").then(mod => {
            return mod.default;
        }),
        // Prevent Next.js from rendering this browser-only editor on the server.
        {ssr: false}
);

// Export the editor's Markdown preview component for displaying saved Markdown text.
export const MarkdownPreview = Editor.Markdown;

// Export the dynamically loaded editor as the default component.
export default RTE;
