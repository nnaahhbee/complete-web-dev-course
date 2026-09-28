"use client"

// Import the authentication store so this layout can check whether a user is signed in.
import { useAuthStore } from "@/store/Auth"
// Import Next.js navigation support for redirecting authenticated users.
import { useRouter } from "next/router";
// Import React types and hooks used by this layout.
import React from "react";

// Define the shared layout for authentication pages, such as login and registration.
// The children parameter represents the page currently displayed inside this layout.
const Layout = ({children}: {children: React.ReactNode}) => {
    // Read the current session from the global authentication store.
    const {session} = useAuthStore();
    // Create a router object that can navigate to another page.
    const router = useRouter()

    // Watch for session changes and redirect signed-in users to the home page.
    React.useEffect(() => {
        if(session){
            router.push("/")
        }
    }, [session, router])

    // Do not render authentication pages while a signed-in user is being redirected.
    if(session){
        return null
    }

    // Render the current authentication page inside the layout's wrapper elements.
    return(
        <div className="">
            <div className="">{children}</div>
        </div>
    )

}

// Export the layout so it can be used by the authentication route pages.
export default Layout