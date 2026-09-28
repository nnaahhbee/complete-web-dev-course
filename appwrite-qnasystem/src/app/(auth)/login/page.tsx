// Tell Next.js this page uses client-side features such as state and event handlers.
"use client"

// Import the authentication actions and React utilities used by this page.
import { useAuthStore } from '@/store/Auth'
import React from 'react'

// Define the login page component.
function LoginPage() {
    // Get the login function from the shared authentication store.
    const {login} = useAuthStore()
    // Track whether the login request is currently in progress.
    const [isLoading, setIslaoding] = React.useState(false)
    // Store a message that can be shown when validation or login fails.
    const [error, setError] = React.useState("")

    // Handle submission of the login form.
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        // Stop the browser from refreshing the page after form submission.
        e.preventDefault()

        // Read all values entered into the submitted form.
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        // Make sure both required fields contain values before contacting Appwrite.
        if (!email || !password) {
            setError(() => "Please fill all fields")
            return  
        }

        // Show the loading state and clear any previous error message.
        setIslaoding(() => true)
        setError(() => "")

        // Ask the authentication store to sign in with the submitted credentials.
        const loginResponse = await login(email.toString(), password.toString())

        // Display the error returned by the login request, if one exists.
        if (loginResponse) {
            setError(() => loginResponse.error!.message)  
        }
         // Allow the user to submit the form again after the request finishes.
         setIslaoding(() => false)
    }

  // Render the login page.
  return (
    <div>page</div>
  )
}

// Export the component so Next.js can use it as the login route.
export default LoginPage