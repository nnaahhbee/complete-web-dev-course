import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

//database connection
connect();

export async function POST(request: NextRequest) {
    try{
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        console.log(reqBody);

        //check if user exist

        const user = await User.findOne({email});

        if(user){
            return NextResponse.json({message: "User already exist"}, {status: 400})
        }

        //hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        //create a new user
       const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        //save the user
        const savedUser = await newUser.save();
        console.log(savedUser);

        return NextResponse.json({message: "User created successfully",
        success: true,
        savedUser})


    }catch(error: any){
        return NextResponse.json({message: error.message}, {status: 500})

    }
}