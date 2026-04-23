import { User } from '../models/user.models.js';
import { ApiError } from '../utils/api_errors.js';
import { asyncHandler } from '../utils/async_handler.js';
import jwt from 'jsonwebtoken';

//middleware to verify JWT token and protect routes
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if(!token){
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  try{
    const decodedToken =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user =await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry",);

    if(!user){
    throw new ApiError(401, "Invalid Access Token");
   }

   req.user = user
   next();

  }catch(error){
    throw new ApiError(401, "Invalid Access Token");
  }
});
