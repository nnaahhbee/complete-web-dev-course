"use client" // the following code is intended to run on the client side
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";



export default function SignupPage() {
    const router = useRouter();
    
    // This state holds the signup form data: username, email, and password.
    // Each `onChange` event updates only one part of the state object.
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",

    });

    const [buttonDisabled, setButtonDisabled] = React.useState(false);

    const [loading, setLoading] = React.useState(false);
      
    // Beginner note:
    // This function sends the form data to the backend signup API. If the server
    // accepts it, the user is redirected to the login page.
    const onSignup = async () => {
        try{
            setLoading(true);
            const response =await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            router.push("/login");
             
        }catch(error:any){
            console.log("Signup failed", error.message);
            toast.error("Something went wrong");

        }finally{
            setLoading(false);
        }

    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
             setButtonDisabled(false);
        }else{
            setButtonDisabled(true);
        }
    }, [user])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing" : "Signup"}</h1>
            <br/>
            <label htmlFor="username">username</label>
            <input
            className="border border-gray-300 rounded-md p-2 mb-4"
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({...user, username: e.target.value})}
            placeholder="username"
            />
            <label htmlFor="email">email</label>
            <input
            className="border border-gray-300 rounded-md p-2 mb-4"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="email"
            />
            <label htmlFor="password">password</label>
            <input
            className="border border-gray-300 rounded-md p-2 mb-4"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="password"
            />
            <button 
            onClick={onSignup}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none focus:border-blue-800
            ">{buttonDisabled ? "No Signup" : "Signup"}
            </button>
            <Link href="/login" className="text-blue-500 hover:underline">Already have an account? Login here</Link>
        </div>
    )
}