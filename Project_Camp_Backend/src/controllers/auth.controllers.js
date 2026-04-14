import {User} from '../models/user.models.js';
import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from '../utils/api_errors.js';
import { emailVerificationTemplate, sendEmail } from '../utils/mail.js';


//helper function to generate access and refresh tokensand save refresh token to user document
const generateAccessAndRefreshTokens = async (userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //save refresh token to user document
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    }catch(error){
        throw new ApiError(500, "Failed to generate access tokens", );

    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    // Check if user with the same email or username already exists
    if(existedUser){
        throw new ApiError(409, "User  with email or username already exists", [])
    }
    
    // Create a new user
    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false,
    });


    //generate hashed and unhashed token for email verification
    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();

    //save hashed token and expiry to user document
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false});

    await sendEmail ({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationTemplate(
            user.username, 
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        ),
    });
 
    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

    if(!createdUser){
        throw new ApiError(500, "Failed to create user");
    }
    
    return res
    .status(201)
    .json(
        new ApiResponse(
         200,
        {user: createdUser},
        "User registered successfully and verification email sent on your email"
        ),      
    );
});

export {registerUser};
