"use client"
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation"
import { useState } from "react";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");

    //function to logout user 
    const logout = async () => {
        try{
           await axios.get('/api/users/logout')
           toast.success("Logout successful");
           router.push("/login");

        }catch(error: any){ 
            console.log("Logout failed", error.message);
            toast.error(error.message);

        }
    }

    //function to get user details
    const getUserDetails = async () => {
      const res = await axios.get('/api/users/me')
      console.log("User details", res.data);
      setData(res.data.data._id);
    }
    
    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr/>
            <p>Welcome to your profile page!</p>
            <h2 className="p-1 rounded bg-purple-500">{data === 'nothing' ? "nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
            <hr/>
            <button 
            onClick={logout}
            className="bg-red-500 mt-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" >
                Logout
            </button>

            <button 
            onClick={getUserDetails}
            className="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " >
                Get User Details
            </button>
        </div>
    )
}