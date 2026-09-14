import { getDataFromToken } from "@/helpers/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import {connect} from "@/dbConfig/dbConfig";

connect();

//route handler to get user data from token
export async function GET(request: NextRequest) {
    try{
        const userId =await getDataFromToken(request);
        const user = await User.findOne({_id: userId}).select("-password");
        return NextResponse.json({message: "User fetched successfully", data: user});

    }catch(error:any){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}