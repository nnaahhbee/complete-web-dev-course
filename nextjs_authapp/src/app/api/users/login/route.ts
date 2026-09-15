import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


// This route handles login. It checks the email and password, then creates a
// JWT token that is saved in a cookie so the user stays logged in.
connect();

export async function POST(request: NextRequest) {
    try{
       const reqBody = await request.json()
       const {email, password} = reqBody;
       console.log(reqBody);

       // Check if the user exists in MongoDB.
       const user = await User.findOne({email})
       if(!user){
        return NextResponse.json({error: "User does not exist"}, {status: 400})
       }

       // Compare the entered password with the stored hashed password.
       const validPassword = await bcryptjs.compare(password, user.password);
         if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
         }
    
       // Create the data that will go inside the JWT.
       const tokenData = {
           id: user._id,
           username: user.username,
           email: user.email
       }

       // Create the token. It is valid for 1 day.
       const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

       const response = NextResponse.json({message: "Login successful", success: true})

       // Save the token in a cookie. httpOnly means the browser keeps it safe
       // and JavaScript cannot read it directly.
       response.cookies.set("token", token, {
           httpOnly: true, })

       return response;

    }catch(error: any) {
       return NextResponse.json({message: error.message}, {status: 500})
    }
}


 