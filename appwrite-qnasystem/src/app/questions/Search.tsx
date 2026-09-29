"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

// Lets visitors search the question list by updating its search query in the URL.
const Search = () => { 
    // Read the current route and query string so the search can preserve other URL filters.
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    // Start with the search term already in the URL, or an empty input if there is none.
    const [search, setSearch] = React.useState(searchParams.get("search") || "");

    // Keep the input in sync if the URL's search term changes, such as when navigating back.
    React.useEffect(() => {
        setSearch(() => searchParams.get("search") || "");
    }, [searchParams]);

    // Prevent a full browser form submission and navigate to the questions page with the new term.
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Copy existing parameters so filters such as the selected page or tag are retained.
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("search", search);
        router.push(`${pathname}?${newSearchParams}`);
    };

    // The controlled input updates search state as the visitor types; submitting runs handleSearch.
    return (
        <form className="flex w-full flex-row gap-4" onSubmit={handleSearch}>
            <Input
                type="text"
                placeholder="Search questions"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                Search
            </button>
        </form>
    );
};

export default Search;