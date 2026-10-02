"use client"

// Import the authentication store so this layout can check whether a user is signed in.
import { useAuthStore } from "@/store/Auth"
// Import Next.js navigation support for redirecting authenticated users.
import { useRouter } from "next/navigation";
// Import React types and hooks used by this layout.
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";

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
   return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
      <BackgroundBeams />
      <div className="relative">{children}</div>
    </div>
  )

}

// Export the layout so it can be used by the authentication route pages.
export default Layout