import jwt from 'jsonwebtoken';
import {User} from '../models/user.models.js';
import {apiError} from '../utils/apiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';

//middleware to verify JWT token
export const verifyJWT = asyncHandler(async (req, res, next) => {
    //get the token from the request header or cookies
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        throw new apiError(401, "Unauthorized, please login to access this resource");
    }

    //verify the token
    try{
       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

       const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

       if(!user){
        throw new apiError(401, "Unauthorized, please login to access this resource");
       }

       req.user = user;

       next();

    }catch(error){
        throw new apiError(401, error?.message || "Unauthorized, please login to access this resource");
    }
})