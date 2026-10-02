// Tell Next.js this page uses client-side features such as state and form events.
"use client"

// Import the authentication actions and React utilities used by this page.
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; 
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import {cn} from "@/lib/utils";


const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
            children,
            className,
        }: {
            children: React.ReactNode;
            className?: string;
        }) => {
            return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};


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
        <div className="mx-auto w-full max-w-md rounded-none border border-solid border-white/30 bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Welcome to Riverflow
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                Signup with riverflow if you you don&apos;t have an account.
                <br /> If you already have an account,{" "}
                <Link href="/login" className="text-orange-500 hover:underline">
                    login
                </Link>{" "}
                to riverflow
            </p>

            {error && (
                <p className="mt-8 text-center text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
            <form className="my-8" onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                    <LabelInputContainer>
                        <Label htmlFor="firstname">First name</Label>
                        <Input className="text-black" id="firstname" name="firstname" placeholder="Tyler" type="text" />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="lastname">Last name</Label>
                        <Input className="text-black"  id="lastname" name="lastname" placeholder="Durden" type="text" />
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                    className="text-black" 
                        id="email"
                        name="email"
                        placeholder="projectmayhem@fc.com"
                        type="email"
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input className="text-black"  id="password" name="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                    disabled={isLoading}
                >
                    Sign up &rarr;
                    <BottomGradient />
                </button>

                <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                <div className="flex flex-col space-y-4">
                    <button
                        className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="button"
                        disabled={isLoading}
                    >
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            Google
                        </span>
                        <BottomGradient />
                    </button>
                    <button
                        className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="button"
                        disabled={isLoading}
                    >
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            GitHub
                        </span>
                        <BottomGradient />
                    </button>
                </div>
            </form>
        </div>
    )
}

// Export the component so Next.js can use it as the registration route.
export default RegisterPage