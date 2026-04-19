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


// method for logging in the user
const login = asyncHandler(async (req, res) => {
    const {email, password, username} = req.body;

    //
    if(!email){
        throw new ApiError(400, "Email is required to login");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(400, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordMatch(password);

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid Credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

 
    // set the cookie
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )

});




export {registerUser, login};
