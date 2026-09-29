"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

// Displays Previous and Next controls for a list split across multiple pages.
const Pagination = ({
    className,
    total,
    limit,
}: {
    className?: string;
    limit: number;
    total: number;
}) => {
    // Read the current URL query string, including the selected page and any active filters.
    const searchParams = useSearchParams();
    // Use page 1 when the URL does not specify a page.
    const page = searchParams.get("page") || "1";
    // Work out how many pages are needed for all results at the given page size.
    const totalPages = Math.ceil(total / limit);
    // These Next.js hooks let the controls change the URL without a full page reload.
    const router = useRouter();
    const pathnanme = usePathname();

    // Go back one page while keeping other query parameters, such as search or tag filters.
    const prev = () => {
        if (page <= "1") return;
        const pageNumber = parseInt(page);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", `${pageNumber - 1}`);
        router.push(`${pathnanme}?${newSearchParams}`);
    };

    // Go forward one page unless the current page is already the last page.
    const next = () => {
        if (page >= `${totalPages}`) return;
        const pageNumber = parseInt(page);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", `${pageNumber + 1}`);
        router.push(`${pathnanme}?${newSearchParams}`);
    };

    // Show the current page, total page count, and navigation buttons.
    return (
        <div className="flex items-center justify-center gap-4">
            <button
                className={`${className} rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20`}
                onClick={prev}
                disabled={page <= "1"}
            >
                Previous
            </button>
            <span>
                {page} of {totalPages || "1"} {/* incase totalPage is 0 */}
            </span>
            <button
                className={`${className} rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20`}
                onClick={next}
                disabled={page >= `${totalPages}`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;