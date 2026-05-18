import { User } from '../models/user.models.js';
import { ProjectMember } from '../models/projectMember.models.js';
import { ApiError } from '../utils/api_errors.js';
import { asyncHandler } from '../utils/async_handler.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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



//middleware to validate project permissions based on user role
export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const {projectId} = req.params;

    //checking if the project id is provided in the request parameters
    if(!projectId){
      throw new ApiError(400, "Project ID is missing");
    }

    //finding the project member based on the project id and user id from the request parameters
    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if(!project){
      throw new ApiError(400, "Project not found");
    }

    //checking if the user has the required role to access the resource
    const givenRole = project?.role

    //attaching the user role to the request object for further use in the controllers
    req.user.role = givenRole;

    //checking if the user role is included in the required roles to access the resource
    if(!roles.includes(givenRole)){
      throw new ApiError(403, "Forbidden: You don't have permission to access this resource");
    }

    //if the user has the required role, allowing access to the resource
    next();

  });
};