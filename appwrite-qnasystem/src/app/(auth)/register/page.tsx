// Tell Next.js this page uses client-side features such as state and form events.
"use client"

// Import the authentication actions and React utilities used by this page.
import { useAuthStore } from "@/store/Auth";
import React from "react";

// Define the account registration page component.
function RegisterPage() {
    // Get account creation and login actions from the shared authentication store.
    const {createAccount, login} = useAuthStore();
    // Track whether registration or automatic login is currently in progress.
    const [isLoading, setIslaoding] = React.useState(false)
    // Store a message that can be displayed when an operation fails.
    const [error, setError] = React.useState("")

    // Handle submission of the registration form.
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        // Prevent the browser from reloading the page after the form is submitted.
        e.preventDefault()

        // Read the values entered into the registration form.
        const formData = new FormData(e.currentTarget)
        const firstname = formData.get("firstname")
        const lastname = formData.get("lastname")
        const email = formData.get("email")
        const password = formData.get("password")

        // Make sure all required registration fields have values.
        if(!firstname || !lastname || !email || !password){
            setError(() => "Please fill out all the fields")
            return
        }

        // Show the loading state and clear any earlier error message.
        setIslaoding(true)
        setError("")

       // Create the new account using the submitted name and credentials.
       const response = await createAccount(
            `${firstname} ${lastname}`,
            email?.toString(),
            password?.toString()
        )

        // Show the account-creation error when Appwrite rejects the request.
        if (response.error) {
            setError(() => response.error!.message)    
        }else{
            // Automatically sign in the user after the account is created successfully.
            const loginResponse = await login(email.toString(), password.toString())
            // Show an error if the automatic login fails.
            if (loginResponse.error) {
                setError(() => loginResponse.error!.message)
            }
        }
        // Allow the user to submit the form again after the requests finish.
        setIslaoding(() => false)
    }

    // Render the registration page, including any error message and the form.
    return (
        <div>{error && (
            // Display an error message only when the error state is not empty.
            <p>{error}</p>
        )}
        {/* Connect form submission to the handleSubmit function. */}
        <form onSubmit={handleSubmit}>


        </form>
        
        </div>
    )
}

// Export the component so Next.js can use it as the registration route.
export default RegisterPage