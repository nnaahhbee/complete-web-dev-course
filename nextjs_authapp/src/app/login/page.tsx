"use client" // the following code is intended to run on the client side
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import {axios} from "axios";



export default function LoginPage() {
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    })
     
    const onLogin = async () => {

    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Login</h1>
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
            ">Login
            </button>
            <Link href="/signup" className="text-blue-500 hover:underline">Don't have an account? Signup here</Link>
        </div>
    )
}