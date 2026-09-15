"use client" // the following code is intended to run on the client side
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";



export default function LoginPage() {
    const router = useRouter();
    // Beginner note:
    // This state stores the form values (email and password). When the user types,
    // `setUser` updates only the field that changed.
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
      

    // Beginner note:
    // This function sends the login form to the backend API. If the API responds
    // successfully, we redirect the user to the profile page.
    const onLogin = async () => {
        try{
            setLoading(true);
            const response =await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login successful");
            router.push("/profile");

        }catch(error:any){
            console.log("Login failed", error.message);
            toast.error("Something went wrong");
        }finally{
            setLoading(false);
        }

    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0) {
                setButtonDisabled(false);
        }else{
            setButtonDisabled(true);
        }

    })

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Logging in..." : "Login"}</h1>
            <br/>
            <label htmlFor="email">email</label>
            <input
            className="border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600
             p-2 mb-4"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="email"
            />
            <label htmlFor="password">password</label>
            <input
            className="border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600
             p-2 mb-4"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="password"
            />
            <button 
            onClick={onLogin}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none focus:border-blue-800
            ">{buttonDisabled ? "No Login" : "Login"}
            </button>
            <Link href="/signup" className="text-blue-500 hover:underline">Don't have an account? Signup here</Link>
        </div>
    )
}