import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

// Beginner note:
// This route handles the signup process. First we connect to MongoDB, then
// we check if the user already exists, hash the password, save the user, and
// send a verification email.
connect();

export async function POST(request: NextRequest) {
    try{
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        console.log(reqBody);

        // Beginner note:
        // This checks whether the email is already saved in the database.
        // If it exists, we do not create a duplicate account.
        const user = await User.findOne({email});

        if(user){
            return NextResponse.json({message: "User already exist"}, {status: 400})
        }

        // Beginner note:
        // We do not save the plain password. Instead, we hash it with bcrypt so
        // that even if someone reads the database, the password stays protected.
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user document with the hashed password.
       const newUser = new User({
            username,
            email,
            password: hashedPassword
        });


        // Save the user to MongoDB.
        const savedUser = await newUser.save();
        console.log(savedUser);


        // After saving the user, send a verification email using a token.
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id});

        
        return NextResponse.json({message: "User created successfully",
        success: true,
        savedUser})


    }catch(error: any){
        return NextResponse.json({message: error.message}, {status: 500})

    }
}