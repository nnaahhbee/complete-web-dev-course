"use client" // the following code is intended to run on the client side
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import {axios} from "axios";



export default function SignupPage() {
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",

    })
     
    const onSignup = async () => {

    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Signup</h1>
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
            ">Signup
            </button>
            <Link href="/login" className="text-blue-500 hover:underline">Already have an account? Login here</Link>
        </div>
    )
}