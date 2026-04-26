import {User} from '../models/user.models.js';
import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from '../utils/api_errors.js';
import { emailVerificationTemplate, forgotPasswordTemplate, sendEmail } from '../utils/mail.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


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


//method for registering a new user
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

    //save the user document
    await user.save({validateBeforeSave: false});

    //send verification email to user
    await sendEmail ({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationTemplate(
            user.username, 
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        ),
    });
 

    //fetch the created user without sensitive information to send in response
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

 
   //cookie security options
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


//method for securely logging out the user
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: null
            }
        },
        {
            new: true
        },
    );

    //cookie security options
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out")
    )

});



//method for getting the currently logged in user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
    )

});


//method for verifying email address of the user
const verifyEmail = asyncHandler(async (req, res) => {

   //get the token from params
   const {verificationToken} = req.params

   //check if token is present
   if(!verificationToken){
    throw new ApiError(400, "Verification token is missing");
   }

   //if token is present, hash the token
   let hashedToken = crypto
   .createHash("sha256")
   .update(verificationToken)
   .digest("hex");
   
   //find the user with the hashed token and check if token is not expired
   const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiry: {$gt: Date.now()}
   })

   if(!user){
    throw new ApiError(400, "Token is expired or invalid");
   }

   //if token is valid, update the user document to set email as verified and remove the token and expiry
   user.emailVerificationToken = undefined;
   user.emailVerificationTokenExpiry = undefined;
 
   //set email as verified and save the user document
   user.isEmailVerified = true;
   await user.save({validateBeforeSave: false});


   //send response to client
   return res
   .status(200)
   .json(
    new ApiResponse(
        200,
        {
            isEmailVerified: true,
        },
        "Email verified successfully, you can now login to your account"
    )
   )

 });



//method for resending email verification token to user email
const resendEmailVerification = asyncHandler(async (req, res) => {

  //fetch the user from database
  const user = await User.findByIdAndUpdate(req.user._id);

  //if user is not found, throw error
  if(!user){
    throw new ApiError(404, "User not found");
  }

  //if user is already verified, throw error
  if(user.isEmailVerified){
    throw new ApiError(409, "Email is already verified");
  }

    //generate hashed and unhashed token for email verification
    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();

    //save hashed token and expiry to user document
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;

    //save the user document to database
    await user.save({validateBeforeSave: false});

    //send verification email to user
    await sendEmail ({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationTemplate(
            user.username, 
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        ),
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Verification email resent successfully, please check your email"
        )
    )
});



//method for refreshing access token
const refreshAccessToken = asyncHandler(async (req, res) => {
   
   //get the refresh token from cookies or request body
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   //if refresh token is not present, throw error
   if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorized, refresh token is missing");
   }

   //if refresh token is present, verify the token
   try{
    const decodedToken = jwt.verify(
        incomingRefreshToken, 
        process.env.REFRESH_TOKEN_SECRET
    );

    //if token is valid, find the user with the id from token 
    const user = await User.findById(decodedToken?._id);
    if(!user){
    throw new ApiError(401, "Invalid refresh token, user not found");
   }

   //and check if refresh token in database matches the incoming refresh token
   if(incomingRefreshToken !== user?.refreshToken){
    throw new ApiError(401, "Refresh token is expired");
   }

   //cookie security options
   const options = {
    httpOnly: true,
    secure: true
   }

   //if token is valid, generate new access and refresh tokens
   const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshTokens(user._id);

   //save the new refresh token to user document
   user.refreshToken = newRefreshToken;
   await user.save();


   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", newRefreshToken, options)
   .json(
    new ApiResponse(
        200,
        {accessToken, refreshToken: newRefreshToken},
        "Access token refreshed successfully"
    )
   )

   }catch(error){
    throw new ApiError(401, "Invalid refresh token");
   }
   
});


//method for handling forgot password request
const forgotPasswordRequest = asyncHandler(async (req, res) => {
    //get email from request body
   const {email} = req.body;

   const user = await User.findOne({email});

   if(!user){
    throw new ApiError(404, "User with this email does not exist");
   }

   //generate hashed and unhashed token for password reset
   const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();


   //save hashed token and expiry to user document
   user.forgotPasswordToken = hashedToken;
   user.forgotPasswordTokenExpiry = tokenExpiry;

   await user.save({validateBeforeSave: false});


   //send password reset instructions to user email
   await sendEmail ({
    email: user?.email,
    subject: "Password Reset Request",
    mailgenContent: forgotPasswordTemplate(
        user.username, 
        `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`,
    ),  
   });


   return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password reset instructions sent to your email, please check your email"
        )
    )

});



//method for resetting password using forgot password token
const resetForgotPassword = asyncHandler(async (req, res) => {
    
    //get the token from params and new password from request body
    const {resetToken} = req.params;
    const {newPassword} = req.body;

    
    //hashes a token using the SHA-256 algorithm
    let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    
    //find the user with the hashed token and check if token is not expired
    const user =await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: {$gt: Date.now()} //token expiry should be greater than current time
    });

    if(!user){
        throw new ApiError(489, "Token is expired or invalid");
    }


    //if token is valid, update the user document to set new password and remove the token and expiry
    user.forgotPasswordTokenExpiry = undefined;
    user.forgotPasswordToken = undefined;

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password reset successfully, you can now login with your new password"
        )
    )

});





// const getCurrentUser = asyncHandler(async (req, res) => {

// });


export {registerUser, login, logoutUser, getCurrentUser, verifyEmail, resendEmailVerification, refreshAccessToken, forgotPasswordRequest};
