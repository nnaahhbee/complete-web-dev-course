import {NextRequest} from "next/server";
import jwt from "jsonwebtoken";

// This helper reads the JWT from the browser cookie, verifies it, and returns
// the user's ID. This is how protected pages or APIs know who is logged in.
export const getDataFromToken = (request: NextRequest) => {
    try{
        const token = request.cookies.get("token")?.value || "";
        const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id;

    }catch(error:any){
        throw new Error(error.message);

    }
}